import { RamenShop } from "../../domain/entities/RamenShop";
import { RamenDensityServicePort } from "../ports/RamenDensityServicePort";
import { DensityDataPoint } from "../../domain/models/DensityDataPoint";

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
  constructor(private readonly densityService: RamenDensityServicePort) {}

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
    // ドメインサービスから得られるDensityDataPointをアプリ層のHeatmapDataPointにマッピング
    const domainData: DensityDataPoint[] = this.densityService.calculateDensity(
      shops,
      boundingBox
    );
    return domainData.map((d) => ({
      position: d.position,
      density: d.density,
    }));
  }
}
