import { RamenShop } from "../entities/RamenShop";

/**
 * ラーメン店リポジトリのインターフェース
 */
export interface IRamenShopRepository {
  /**
   * 指定されたエリア内のラーメン店を取得
   * @param boundingBox エリアの境界ボックス [minLon, minLat, maxLon, maxLat]
   */
  findByArea(
    boundingBox: [number, number, number, number]
  ): Promise<RamenShop[]>;
}
