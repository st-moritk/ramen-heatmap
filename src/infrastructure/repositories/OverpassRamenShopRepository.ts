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
   * 指定されたタイプのラーメン店を取得
   * @param type ラーメン店のタイプ（例：二郎系、家系）
   * @param boundingBox オプションのエリア制限
   */
  async findByType(
    type: string,
    boundingBox?: [number, number, number, number]
  ): Promise<RamenShop[]> {
    if (boundingBox) {
      const shops = await this.findByArea(boundingBox);
      return shops.filter((shop) => shop.type === type);
    }

    // 全国検索は効率が悪いため、東京エリアを設定
    const tokyoArea: [number, number, number, number] = [
      139.5, // 西経（東京西部）
      35.5, // 南緯（東京南部）
      140.0, // 東経（東京東部）
      36.0, // 北緯（東京北部）
    ];

    const shops = await this.findByArea(tokyoArea);
    return shops.filter((shop) => shop.type === type);
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
