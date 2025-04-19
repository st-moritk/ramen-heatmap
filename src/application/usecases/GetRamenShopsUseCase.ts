import { RamenShop } from "../../domain/entities/RamenShop";
import { RamenShopRepository } from "../ports/RamenShopRepository";

/**
 * 指定されたエリア内のラーメン店を取得するユースケース
 */
export class GetRamenShopsUseCase {
  constructor(private readonly repository: RamenShopRepository) {}

  /**
   * 指定したバウンディングボックス内のラーメン店舗を取得
   * @param boundingBox エリアの境界ボックス [minLon, minLat, maxLon, maxLat]
   */
  async execute(
    boundingBox: [number, number, number, number]
  ): Promise<RamenShop[]> {
    // バウンディングボックスを北緯、南緯、東経、西経の形式に変換
    const bounds = {
      north: boundingBox[3], // maxLat
      south: boundingBox[1], // minLat
      east: boundingBox[2], // maxLon
      west: boundingBox[0], // minLon
    };

    return this.repository.findInBounds(bounds);
  }
}
