import { RamenShop } from "../../domain/entities/RamenShop";

/**
 * ラーメン店リポジトリのアプリケーション層インターフェース
 */
export interface RamenShopRepository {
  /**
   * 指定された境界内のラーメン店を取得
   */
  findInBounds(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<RamenShop[]>;
}
