import { RamenShop } from "../../domain/entities/RamenShop";
import { RamenDensityService } from "../../domain/services/RamenDensityService";

/**
 * ヒートマップデータ型の定義
 */
export interface HeatmapDataPoint {
  position: [number, number];
  density: number;
}

/**
 * ラーメン店のヒートマップデータを生成するユースケース
 */
export class GetHeatmapDataUseCase {
  constructor(private readonly densityService: RamenDensityService) {}

  /**
   * ラーメン店舗データからヒートマップデータを生成
   * @param shops ラーメン店舗データ
   * @param boundingBox エリアの境界ボックス [minLon, minLat, maxLon, maxLat]
   * @returns ヒートマップデータ
   */
  execute(
    shops: RamenShop[],
    boundingBox: [number, number, number, number]
  ): HeatmapDataPoint[] {
    return this.densityService.calculateDensity(shops, boundingBox);
  }
}
