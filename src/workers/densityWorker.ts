// Web Worker for heatmap density calculation
import type { HeatmapDataPoint } from "@/application/usecases/GetHeatmapDataUseCase";

interface WorkerInput {
  positions: [number, number][];
  bbox: [number, number, number, number];
  gridSize?: { x: number; y: number };
}

self.addEventListener("message", (event) => {
  const {
    positions,
    bbox,
    gridSize = { x: 10, y: 10 },
  } = event.data as WorkerInput;
  const [minLon, minLat, maxLon, maxLat] = bbox;
  const width = maxLon - minLon;
  const height = maxLat - minLat;
  const cellWidth = width / gridSize.x;
  const cellHeight = height / gridSize.y;

  const densityMap: HeatmapDataPoint[] = [];
  for (let gx = 0; gx < gridSize.x; gx++) {
    for (let gy = 0; gy < gridSize.y; gy++) {
      const cellMinLon = minLon + gx * cellWidth;
      const cellMinLat = minLat + gy * cellHeight;
      let count = 0;
      for (const [lon, lat] of positions) {
        if (
          lon >= cellMinLon &&
          lon < cellMinLon + cellWidth &&
          lat >= cellMinLat &&
          lat < cellMinLat + cellHeight
        ) {
          count++;
        }
      }
      if (count > 0) {
        densityMap.push({
          position: [cellMinLon + cellWidth / 2, cellMinLat + cellHeight / 2],
          density: count,
        });
      }
    }
  }

  // 生成した密度データをメインスレッドに返却
  postMessage(densityMap);
});
