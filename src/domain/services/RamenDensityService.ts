import { RamenShop } from "../entities/RamenShop";
import { HeatmapDataPoint } from "../../application/usecases/GetHeatmapDataUseCase";

/**
 * ラーメン店の密度を計算するドメインサービス
 */
export class RamenDensityService {
  /**
   * ラーメン店の密度を計算し、ヒートマップデータとして返す
   * @param shops ラーメン店リスト
   * @param area エリアの境界 [minLon, minLat, maxLon, maxLat]
   * @param gridSize グリッドサイズ（オプション）
   * @returns 密度データ（グリッド位置と密度値のマップ）
   */
  calculateDensity(
    shops: RamenShop[],
    area: [number, number, number, number],
    gridSize: { x: number; y: number } = { x: 10, y: 10 }
  ): HeatmapDataPoint[] {
    const densityMap: HeatmapDataPoint[] = [];

    // エリアの幅と高さを計算
    const width = area[2] - area[0];
    const height = area[3] - area[1];

    // グリッドごとのセルサイズを計算
    const cellWidth = width / gridSize.x;
    const cellHeight = height / gridSize.y;

    // 各グリッドセルの密度を計算
    for (let x = 0; x < gridSize.x; x++) {
      for (let y = 0; y < gridSize.y; y++) {
        // セルの境界を計算
        const cellMinLon = area[0] + x * cellWidth;
        const cellMinLat = area[1] + y * cellHeight;
        const cellMaxLon = cellMinLon + cellWidth;
        const cellMaxLat = cellMinLat + cellHeight;

        // セル内の店舗数をカウント
        const shopsInCell = shops.filter((shop) => {
          const location = shop.location;
          return (
            location.longitude >= cellMinLon &&
            location.longitude < cellMaxLon &&
            location.latitude >= cellMinLat &&
            location.latitude < cellMaxLat
          );
        });

        // 密度がある場合のみ追加
        if (shopsInCell.length > 0) {
          densityMap.push({
            position: [
              cellMinLon + cellWidth / 2, // セルの中心のlongitude
              cellMinLat + cellHeight / 2, // セルの中心のlatitude
            ],
            density: shopsInCell.length,
          });
        }
      }
    }

    return densityMap;
  }
}
