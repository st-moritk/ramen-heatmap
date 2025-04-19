"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl";
import { GeoPoint } from "../lib/overpass";

// Mapbox APIキー
// 注意: 実際のプロジェクトではAPIキーを環境変数に設定すること
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// 池袋駅を中心とする初期表示設定
const INITIAL_VIEW_STATE = {
  longitude: 139.7109, // 池袋駅の経度
  latitude: 35.7295, // 池袋駅の緯度
  zoom: 14,
  pitch: 0,
  bearing: 0,
  maxZoom: 16,
  minZoom: 11,
};

// コンポーネントのプロパティ型
interface RamenHeatmapProps {
  data?: GeoPoint[];
  isLoading?: boolean;
  error?: string;
  initialDataUrl?: string; // 初期データ取得URL
}

// レイヤーのイベント情報型
interface LayerInfo {
  object?: GeoPoint;
  x?: number;
  y?: number;
  coordinate?: number[];
  // その他の必要なプロパティ
}

// viewState型
interface ViewState {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch: number;
  bearing: number;
  // その他のプロパティ
}

const RamenHeatmap: React.FC<RamenHeatmapProps> = ({
  data = [],
  isLoading = false,
  error = "",
  initialDataUrl = "/api/ramen", // デフォルトURLを設定
}) => {
  const [viewState, setViewState] = useState<ViewState>(INITIAL_VIEW_STATE);
  const [ramenData, setRamenData] = useState<GeoPoint[]>(data || []);
  const [showPoints, setShowPoints] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [dataError, setDataError] = useState("");

  // データ取得が完了したかを追跡するref
  const dataFetchedRef = useRef(false);

  // データプロップが変更されたらステートを更新
  useEffect(() => {
    if (data && data.length > 0) {
      setRamenData(data);
      dataFetchedRef.current = true; // データが提供された場合はフェッチ済みとマーク
    }
  }, [data]);

  // 自前でデータ取得（初回レンダリング時のみ）
  useEffect(() => {
    // すでにデータが提供されている場合はスキップ
    if (data && data.length > 0) {
      return;
    }

    // すでにデータ取得が実行済みの場合はスキップ
    if (dataFetchedRef.current) {
      return;
    }

    const fetchData = async () => {
      try {
        // データ取得を一度だけ実行するようマーク
        dataFetchedRef.current = true;

        setIsDataLoading(true);
        console.log("初回データ取得を実行します: " + initialDataUrl);

        const response = await fetch(initialDataUrl);
        if (!response.ok) {
          throw new Error("データを取得できませんでした");
        }

        const result = await response.json();
        console.log(
          `データ取得成功: ${result.data.length}件のデータを読み込みました`
        );
        setRamenData(result.data);
        setIsDataLoading(false);
      } catch (err) {
        console.error("データ取得エラー:", err);
        setDataError(err instanceof Error ? err.message : "不明なエラー");
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [initialDataUrl, data]); // 依存配列にはinitialDataUrlを含める（変更時に再フェッチ）

  // ヒートマップレイヤーとポイントレイヤーの設定
  const layers = useMemo(() => {
    const layers = [];

    // ヒートマップレイヤー（密度の可視化）
    layers.push(
      new HeatmapLayer({
        id: "heatmap-layer",
        data: ramenData,
        getPosition: (d: GeoPoint) => d.position,
        getWeight: 1,
        radiusPixels: 40,
        intensity: 3,
        threshold: 0.05,
        colorRange: [
          [255, 255, 204],
          [255, 237, 160],
          [254, 217, 118],
          [254, 178, 76],
          [253, 141, 60],
          [240, 59, 32],
        ],
      })
    );

    // ポイントレイヤー（個別店舗の表示、ズームレベルが高い場合に表示）
    if (showPoints || viewState.zoom > 14) {
      layers.push(
        new ScatterplotLayer({
          id: "point-layer",
          data: ramenData,
          pickable: true,
          opacity: 0.8,
          stroked: true,
          filled: true,
          radiusScale: 6,
          radiusMinPixels: 3,
          radiusMaxPixels: 12,
          lineWidthMinPixels: 1,
          getPosition: (d: GeoPoint) => d.position,
          getRadius: 5,
          getFillColor: [255, 0, 0],
          getLineColor: [0, 0, 0],
          onClick: (info: LayerInfo) => {
            if (info.object) {
              alert(
                `${
                  info.object.name || "ラーメン店"
                }\n位置: ${info.object.position.join(", ")}`
              );
            }
          },
        })
      );
    }

    return layers;
  }, [ramenData, showPoints, viewState.zoom]);

  // 読み込み中表示
  if (isLoading || isDataLoading) {
    return <div className="loading">ラーメン店データを読み込み中...</div>;
  }

  // エラー表示
  if (error || dataError) {
    return <div className="error">エラー: {error || dataError}</div>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "80vh" }}>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        viewState={viewState}
        onViewStateChange={({
          viewState: newViewState,
        }: {
          viewState: ViewState;
        }) => setViewState(newViewState)}
        controller={true}
        layers={layers}
        getTooltip={({ object }: { object?: GeoPoint }) =>
          object && `${object.name || "ラーメン店"}`
        }
      >
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/dark-v10"
        />
      </DeckGL>

      <div
        className="map-overlay"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px",
          background: "rgba(255, 255, 255, 0.8)",
          borderRadius: "4px",
          maxWidth: "250px",
        }}
      >
        <h3>池袋ラーメンヒートマップ</h3>
        <p>表示店舗数: {ramenData.length}件</p>
        <div className="controls">
          <label>
            <input
              type="checkbox"
              checked={showPoints}
              onChange={() => setShowPoints(!showPoints)}
            />
            ポイント表示
          </label>
        </div>
      </div>
    </div>
  );
};

export default RamenHeatmap;
