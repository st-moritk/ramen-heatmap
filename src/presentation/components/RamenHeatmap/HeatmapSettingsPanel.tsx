"use client";

import React, { useState, useEffect, useRef } from "react";
import { Box, Text, Button, Flex } from "@chakra-ui/react";
import { FiMenu, FiX } from "react-icons/fi";
import { HeatmapSettings } from "./RamenHeatmapViewModel";
import { useIsMobile } from "@/hooks/useIsMobile";

interface HeatmapSettingsPanelProps {
  heatmapSettings: HeatmapSettings;
  setHeatmapSettings: React.Dispatch<React.SetStateAction<HeatmapSettings>>;
}

export const HeatmapSettingsPanel = ({
  heatmapSettings,
  setHeatmapSettings,
}: HeatmapSettingsPanelProps): JSX.Element => {
  const [sliderRadius, setSliderRadius] = useState(heatmapSettings.radius);
  const debounceRadiusTimer = useRef<number | null>(null);
  const [sliderIntensity, setSliderIntensity] = useState(
    heatmapSettings.intensity
  );
  const debounceIntensityTimer = useRef<number | null>(null);
  const [sliderThreshold, setSliderThreshold] = useState(
    heatmapSettings.threshold
  );
  const debounceThresholdTimer = useRef<number | null>(null);

  const [isOpen, setIsOpen] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [isMobile]);

  useEffect(() => {
    setSliderRadius(heatmapSettings.radius);
    setSliderIntensity(heatmapSettings.intensity);
    setSliderThreshold(heatmapSettings.threshold);
  }, [
    heatmapSettings.radius,
    heatmapSettings.intensity,
    heatmapSettings.threshold,
  ]);

  useEffect(() => {
    return () => {
      if (debounceRadiusTimer.current)
        window.clearTimeout(debounceRadiusTimer.current);
      if (debounceIntensityTimer.current)
        window.clearTimeout(debounceIntensityTimer.current);
      if (debounceThresholdTimer.current)
        window.clearTimeout(debounceThresholdTimer.current);
    };
  }, []);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setSliderRadius(val);
    if (debounceRadiusTimer.current)
      window.clearTimeout(debounceRadiusTimer.current);
    debounceRadiusTimer.current = window.setTimeout(() => {
      setHeatmapSettings((prev) => ({ ...prev, radius: val }));
    }, 200);
  };

  const handleIntensityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderIntensity(val);
    if (debounceIntensityTimer.current)
      window.clearTimeout(debounceIntensityTimer.current);
    debounceIntensityTimer.current = window.setTimeout(() => {
      setHeatmapSettings((prev) => ({ ...prev, intensity: val }));
    }, 200);
  };

  const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSliderThreshold(val);
    if (debounceThresholdTimer.current)
      window.clearTimeout(debounceThresholdTimer.current);
    debounceThresholdTimer.current = window.setTimeout(() => {
      setHeatmapSettings((prev) => ({ ...prev, threshold: val }));
    }, 200);
  };

  const togglePanel = () => setIsOpen(!isOpen);

  if (!isOpen && isMobile) {
    return (
      <Button
        aria-label="設定を開く"
        position="absolute"
        top="10px"
        right="10px"
        zIndex={4}
        onClick={togglePanel}
        size="sm"
        colorScheme="whiteAlpha"
        backgroundColor="rgba(74, 85, 105, 0.85)"
        color="white"
        boxShadow="md"
        p="2"
        minW="auto"
      >
        <Box as={FiMenu} fontSize="20px" />
      </Button>
    );
  }

  return (
    <Box
      position="absolute"
      top="10px"
      right="10px"
      bg="white"
      p="3"
      borderRadius="md"
      boxShadow="md"
      zIndex={4}
      width={{ base: "calc(100% - 20px)", md: "220px" }}
      display={isOpen ? "block" : "none"}
    >
      {isMobile && (
        <Button
          aria-label="設定を閉じる"
          size="sm"
          position="absolute"
          top="8px"
          right="8px"
          onClick={togglePanel}
          variant="ghost"
          p="1"
        >
          <Box as={FiX} />
        </Button>
      )}
      <Box mb={isMobile ? "8" : "2"}>
        <Text fontSize="sm" fontWeight="bold" mb="2">
          ヒートマップ設定
        </Text>
      </Box>
      <Box mb="2">
        <Text fontSize="xs" mb="1">
          強度: {sliderIntensity.toFixed(1)}
        </Text>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.1"
          value={sliderIntensity}
          onChange={handleIntensityChange}
          style={{ width: "100%" }}
        />
      </Box>
      <Box mb="2">
        <Text fontSize="xs" mb="1">
          閾値: {sliderThreshold.toFixed(2)}
        </Text>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={sliderThreshold}
          onChange={handleThresholdChange}
          style={{ width: "100%" }}
        />
      </Box>
      <Box>
        <Text fontSize="xs" mb="1">
          半径: {sliderRadius}
        </Text>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={sliderRadius}
          onChange={handleRadiusChange}
          style={{ width: "100%" }}
        />
      </Box>
    </Box>
  );
};
