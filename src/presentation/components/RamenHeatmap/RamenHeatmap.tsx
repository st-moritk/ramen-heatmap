"use client";

import React, { useEffect } from "react";
import { useRamenHeatmapViewModel, ViewState } from "./RamenHeatmapViewModel";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import Map from "react-map-gl";
import { HeatmapDataPoint } from "@/application/usecases/GetHeatmapDataUseCase";
import { Box, Text } from "@chakra-ui/react";
import { useUseCaseContext } from "@/providers";

/**
 * ラーメン店舗のヒートマップを表示するコンポーネント
 */
export const RamenHeatmap: React.FC = () => {
  const { getRamenShopsUseCase, getHeatmapDataUseCase, mapboxAccessToken } =
    useUseCaseContext();

  const {
    viewState,
    onViewStateChange,
    heatmapData,
    heatmapSettings,
    isLoading,
    error,
    loadData,
  } = useRamenHeatmapViewModel(getRamenShopsUseCase, getHeatmapDataUseCase);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    <Box width="100%" height="100vh" position="relative">
      {isLoading && (
        <Box
          position="absolute"
          top="10px"
          left="10px"
          zIndex={1}
          bg="white"
          p="5px 10px"
          borderRadius="5px"
          boxShadow="0 0 10px rgba(0,0,0,0.2)"
        >
          データを読み込み中...
        </Box>
      )}

      {error && (
        <Box
          position="absolute"
          top="10px"
          left="10px"
          zIndex={1}
          bg="#fee"
          color="#c00"
          p="5px 10px"
          borderRadius="5px"
          boxShadow="0 0 10px rgba(0,0,0,0.2)"
        >
          エラー: {error.message}
        </Box>
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
          mapboxAccessToken={mapboxAccessToken}
        />
      </DeckGL>

      <Box
        position="absolute"
        bottom="10px"
        right="10px"
        bg="white"
        p="5px 10px"
        borderRadius="5px"
        boxShadow="0 0 10px rgba(0,0,0,0.2)"
        fontSize="12px"
      >
        <Text>ラーメン店舗数: {heatmapData.length}</Text>
      </Box>
    </Box>
  );
};
