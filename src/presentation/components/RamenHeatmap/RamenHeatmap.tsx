"use client";

import React, { useEffect } from "react";
import { useRamenHeatmapViewModel, ViewState } from "./RamenHeatmapViewModel";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import Map, { NavigationControl, Marker } from "react-map-gl";
import { RamenShop } from "@/domain/entities/RamenShop";
import { Box, Text } from "@chakra-ui/react";
import { useUseCaseContext } from "@/providers";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

/**
 * ラーメン店舗のヒートマップを表示するコンポーネント
 */
export const RamenHeatmap: React.FC = () => {
  const { getRamenShopsUseCase, getHeatmapDataUseCase } = useUseCaseContext();

  const {
    viewState,
    onViewStateChange,
    heatmapSettings,
    isLoading,
    error,
    loadData,
    shops,
  } = useRamenHeatmapViewModel(getRamenShopsUseCase, getHeatmapDataUseCase);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const layers = [
    new HeatmapLayer({
      id: "heatmap-layer",
      data: shops,
      getPosition: (shop: RamenShop) => shop.getPosition(),
      getWeight: () => 1,
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
          mapLib={maplibregl}
          mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
        >
          <NavigationControl position="top-left" />
          <Marker longitude={139.7109} latitude={35.7295} offset={[0, -10]}>
            <Box bg="white" p="2px" borderRadius="3px" fontSize="12px">
              池袋駅
            </Box>
          </Marker>
        </Map>
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
        <Text>ラーメン店舗数: {shops.length}</Text>
      </Box>
    </Box>
  );
};
