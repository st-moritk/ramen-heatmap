"use client";

import { useState, useCallback } from "react";
import { RamenShop } from "@/domain/entities/RamenShop";
import { GetRamenShopsUseCase } from "@/application/usecases/GetRamenShopsUseCase";
import {
  GetHeatmapDataUseCase,
  HeatmapDataPoint,
} from "@/application/usecases/GetHeatmapDataUseCase";

export interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
}

export interface HeatmapSettings {
  intensity: number;
  threshold: number;
  radius: number;
  colorRange: number[][];
}

// 東京の中心座標（池袋駅）
const INITIAL_VIEW_STATE: ViewState = {
  longitude: 139.7109,
  latitude: 35.7295,
  zoom: 13,
  pitch: 0,
  bearing: 0,
};

// ヒートマップのデフォルト設定
const DEFAULT_HEATMAP_SETTINGS: HeatmapSettings = {
  intensity: 1,
  threshold: 0.03,
  radius: 20,
  colorRange: [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78],
  ],
};

/**
 * 現在のビュー状態から表示領域のバウンディングボックスを計算
 * @param viewState 現在のビュー状態
 * @returns バウンディングボックス [minLon, minLat, maxLon, maxLat]
 */
const calculateBoundingBox = (
  viewState: ViewState
): [number, number, number, number] => {
  // 経度1度あたりの距離（赤道上で約111km）
  const metersPerLongitudeDegree =
    111000 * Math.cos((viewState.latitude * Math.PI) / 180);
  // 緯度1度あたりの距離（約111km）
  const metersPerLatitudeDegree = 111000;

  // 現在のビューの半径（メートル）
  const viewRadiusMeters = 1000 * Math.pow(2, 16 - viewState.zoom);

  // 経度緯度の変化量を計算
  const deltaLongitude = viewRadiusMeters / metersPerLongitudeDegree;
  const deltaLatitude = viewRadiusMeters / metersPerLatitudeDegree;

  // バウンディングボックスを返す
  return [
    viewState.longitude - deltaLongitude, // minLon
    viewState.latitude - deltaLatitude, // minLat
    viewState.longitude + deltaLongitude, // maxLon
    viewState.latitude + deltaLatitude, // maxLat
  ];
};

/**
 * ラーメンヒートマップのビューモデルカスタムフック
 */
export const useRamenHeatmapViewModel = (
  getRamenShopsUseCase: GetRamenShopsUseCase,
  getHeatmapDataUseCase: GetHeatmapDataUseCase
) => {
  // ビュー状態
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  // ロード状態
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // エラー状態
  const [error, setError] = useState<Error | null>(null);
  // 店舗データ
  const [shops, setShops] = useState<RamenShop[]>([]);
  // ヒートマップデータ
  const [heatmapData, setHeatmapData] = useState<HeatmapDataPoint[]>([]);
  // ヒートマップ設定
  const [heatmapSettings] = useState<HeatmapSettings>(DEFAULT_HEATMAP_SETTINGS);

  // 表示領域が変更されたときのコールバック
  const onViewStateChange = useCallback((newViewState: ViewState) => {
    setViewState(newViewState);
  }, []);

  // データを読み込む関数
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 現在の表示領域からバウンディングボックスを計算
      const boundingBox = calculateBoundingBox(viewState);

      // ラーメン店データを取得
      const shopData = await getRamenShopsUseCase.execute(boundingBox);
      setShops(shopData);

      // ヒートマップデータを生成
      const heatmap = getHeatmapDataUseCase.execute(shopData, boundingBox);
      setHeatmapData(heatmap);
    } catch (err) {
      console.error("データ取得エラー:", err);
      setError(
        err instanceof Error ? err : new Error("データ取得に失敗しました")
      );
    } finally {
      setIsLoading(false);
    }
  }, [viewState, getRamenShopsUseCase, getHeatmapDataUseCase]);

  return {
    viewState,
    onViewStateChange,
    shops,
    heatmapData,
    heatmapSettings,
    isLoading,
    error,
    loadData,
  };
};
