import { RamenShop } from "../../domain/entities/RamenShop";
import { IRamenShopRepository } from "../../domain/repositories/IRamenShopRepository";

/**
 * 指定されたエリア内のラーメン店を取得するユースケース
 */
export class GetRamenShopsUseCase {
  constructor(private readonly repository: IRamenShopRepository) {}

  /**
   * 指定したバウンディングボックス内のラーメン店舗を取得
   * @param boundingBox エリアの境界ボックス [minLon, minLat, maxLon, maxLat]
   */
  async execute(
    boundingBox: [number, number, number, number]
  ): Promise<RamenShop[]> {
    // ドメインリポジトリの findByArea を利用
    return this.repository.findByArea(boundingBox);
  }
}
