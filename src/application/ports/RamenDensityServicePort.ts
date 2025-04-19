import { RamenShop } from "../../domain/entities/RamenShop";
import { DensityDataPoint } from "../../domain/models/DensityDataPoint";

/**
 * ラーメン店の密度計算サービスのポート
 */
export interface RamenDensityServicePort {
  /**
   * ラーメン店舗の密度を計算する
   */
  calculateDensity(
    shops: RamenShop[],
    boundingBox: [number, number, number, number]
  ): DensityDataPoint[];
}
