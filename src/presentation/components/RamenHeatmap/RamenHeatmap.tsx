"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { useRamenHeatmapViewModel, ViewState } from "./RamenHeatmapViewModel";
import DeckGL from "@deck.gl/react";
import { HeatmapLayer } from "@deck.gl/aggregation-layers";
import Map, { NavigationControl, Marker } from "react-map-gl";
import { RamenShop } from "@/domain/entities/RamenShop";
import { Box, Text } from "@chakra-ui/react";
import { useUseCaseContext } from "@/providers";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ScatterplotLayer } from "@deck.gl/layers";
import { HeatmapSettingsPanel } from "./HeatmapSettingsPanel";

/**
 * ラーメン店舗のヒートマップを表示するコンポーネント
 */
export const RamenHeatmap = (): JSX.Element => {
  const { getRamenShopsUseCase } = useUseCaseContext();
  // hover情報保持
  const [hoverInfo, setHoverInfo] = useState<{
    x: number;
    y: number;
    shop: RamenShop;
  } | null>(null);
  // デバウンスタイマー
  const timerRef = useRef<number | null>(null);
  const {
    viewState,
    onViewStateChange,
    shops,
    heatmapSettings,
    setHeatmapSettings,
    isLoading,
    error,
    loadData,
  } = useRamenHeatmapViewModel(getRamenShopsUseCase);

  // viewState変化時に500ms後にloadDataを呼び、前のタイマーはクリア
  useEffect(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      loadData();
    }, 500);
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [viewState, loadData]);

  const layers = useMemo(
    () => [
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
      new ScatterplotLayer({
        id: "scatter-layer",
        data: shops,
        pickable: true,
        radiusPixels: 10,
        getPosition: (shop: RamenShop) => shop.getPosition(),
        getFillColor: [0, 0, 0, 0],
        onHover: (info: { x: number; y: number; object?: RamenShop }) => {
          const { x, y, object } = info;
          if (object) setHoverInfo({ x, y, shop: object });
          else setHoverInfo(null);
        },
      }),
    ],
    [shops, heatmapSettings]
  );

  return (
    <Box
      width="100%"
      height="100vh"
      position="relative"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* ヒートマップ設定パネル */}
      <HeatmapSettingsPanel
        heatmapSettings={heatmapSettings}
        setHeatmapSettings={setHeatmapSettings}
      />

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

      {/* ポップアップ表示 */}
      {hoverInfo && (
        <Box
          position="absolute"
          left={hoverInfo.x + 10}
          top={hoverInfo.y + 10}
          bg="white"
          p="2px 6px"
          fontSize="xs"
          borderRadius="3px"
          boxShadow="0 0 5px rgba(0,0,0,0.3)"
          pointerEvents="none"
          zIndex={3}
        >
          {hoverInfo.shop.name}
        </Box>
      )}

      {/* 地図領域 */}
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
