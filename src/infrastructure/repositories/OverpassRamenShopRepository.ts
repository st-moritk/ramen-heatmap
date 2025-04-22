import { IRamenShopRepository } from "../../domain/repositories/IRamenShopRepository";
import { RamenShop } from "../../domain/entities/RamenShop";
import { RamenShopFactory } from "../../domain/factories/RamenShopFactory";
import { OSMNode } from "../clients/OverpassApiClient";
import { OverpassApiPort } from "../../application/ports/OverpassApiPort";

/**
 * OpenStreetMapデータを使用したラーメン店リポジトリの実装
 */
export class OverpassRamenShopRepository implements IRamenShopRepository {
  constructor(private readonly apiClient: OverpassApiPort) {}

  /**
   * 指定されたエリア内のラーメン店を取得
   * @param boundingBox エリアの境界ボックス [minLon, minLat, maxLon, maxLat]
   */
  async findByArea(
    boundingBox: [number, number, number, number]
  ): Promise<RamenShop[]> {
    try {
      // 境界をAPIクライアントに渡す形式に変換
      const bounds = {
        north: boundingBox[3], // maxLat
        south: boundingBox[1], // minLat
        east: boundingBox[2], // maxLon
        west: boundingBox[0], // minLon
      };

      // APIからデータを取得
      const elements = await this.apiClient.fetchRamenShops(bounds);

      // エンティティに変換して返す
      return this.mapToEntities(elements);
    } catch (error) {
      console.error("ラーメン店検索エラー:", error);
      // エラー発生時は空配列を返す（または適切なエラーハンドリング）
      return [];
    }
  }

  /**
   * API取得データをドメインエンティティに変換
   */
  private mapToEntities(elements: OSMNode[]): RamenShop[] {
    return elements
      .filter((el) => el.lat && el.lon)
      .map((el) => RamenShopFactory.createFromOSM(el));
  }
}
