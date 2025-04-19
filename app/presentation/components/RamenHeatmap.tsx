"use client";

import React, { useEffect } from "react";
import {
  useRamenHeatmapViewModel,
  ViewState,
} from "../../../src/presentation/components/RamenHeatmap/RamenHeatmapViewModel";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import Map from "react-map-gl";
import { GetRamenShopsUseCase } from "../../../src/application/usecases/GetRamenShopsUseCase";
import {
  GetHeatmapDataUseCase,
  HeatmapDataPoint,
} from "../../../src/application/usecases/GetHeatmapDataUseCase";
import { RamenDensityService } from "../../../src/domain/services/RamenDensityService";
import { OverpassRamenShopRepository } from "../../../src/infrastructure/repositories/OverpassRamenShopRepository";
import { OverpassApiClient } from "../../../src/infrastructure/clients/OverpassApiClient";

// Mapboxのアクセストークン（環境変数から取得）
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

/**
 * ラーメン店舗のヒートマップを表示するコンポーネント
 */
export const RamenHeatmap: React.FC = () => {
  // 依存関係の構築
  const apiClient = new OverpassApiClient();
  const repository = new OverpassRamenShopRepository(apiClient);
  const densityService = new RamenDensityService();
  const getRamenShopsUseCase = new GetRamenShopsUseCase(repository);
  const getHeatmapDataUseCase = new GetHeatmapDataUseCase(densityService);

  // ビューモデルを使用
  const {
    viewState,
    onViewStateChange,
    heatmapData,
    heatmapSettings,
    isLoading,
    error,
    loadData,
  } = useRamenHeatmapViewModel(getRamenShopsUseCase, getHeatmapDataUseCase);

  // コンポーネントのマウント時にデータを読み込む
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ヒートマップレイヤーを作成
  const layers = [
    new HeatmapLayer({
      id: "heatmap-layer",
      data: heatmapData,
      getPosition: (d: HeatmapDataPoint) => d.position,
      getWeight: (d: HeatmapDataPoint) => d.density,
      radiusPixels: heatmapSettings.radius,
      intensity: heatmapSettings.intensity,
      threshold: heatmapSettings.threshold,
      colorRange: heatmapSettings.colorRange,
    }),
  ];

  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      {isLoading && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            backgroundColor: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          データを読み込み中...
        </div>
      )}

      {error && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            zIndex: 1,
            backgroundColor: "#fee",
            color: "#c00",
            padding: "5px 10px",
            borderRadius: "5px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          }}
        >
          エラー: {error.message}
        </div>
      )}

      <DeckGL
        layers={layers}
        viewState={viewState}
        onViewStateChange={(e: { viewState: ViewState }) =>
          onViewStateChange(e.viewState)
        }
        controller={true}
      >
        <Map
          mapStyle="mapbox://styles/mapbox/light-v11"
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>

      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          fontSize: "12px",
        }}
      >
        ラーメン店舗数: {heatmapData.length}
      </div>
    </div>
  );
};
