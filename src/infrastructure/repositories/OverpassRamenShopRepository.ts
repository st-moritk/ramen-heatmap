import { IRamenShopRepository } from "../../domain/repositories/IRamenShopRepository";
import { RamenShop } from "../../domain/entities/RamenShop";
import { Location } from "../../domain/entities/Location";
import { OverpassApiClient, OSMNode } from "../clients/OverpassApiClient";
import { RamenShopRepository } from "../../application/ports/RamenShopRepository";

/**
 * OpenStreetMapデータを使用したラーメン店リポジトリの実装
 */
export class OverpassRamenShopRepository
  implements IRamenShopRepository, RamenShopRepository
{
  constructor(private readonly apiClient: OverpassApiClient) {}

  /**
   * 指定されたエリア内のラーメン店を取得
   * @param boundingBox エリアの境界ボックス [minLon, minLat, maxLon, maxLat]
   */
  async findByArea(
    boundingBox: [number, number, number, number]
  ): Promise<RamenShop[]> {
    try {
      // Overpass QLクエリを構築
      const query = this.apiClient.buildRamenQuery(boundingBox);

      // APIからデータを取得
      const response = await this.apiClient.query(query);

      // エンティティに変換して返す
      return this.mapToEntities(response.elements);
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
    try {
      // タイプ指定のクエリを構築
      const query = this.apiClient.buildRamenTypeQuery(type, boundingBox);

      // APIからデータを取得
      const response = await this.apiClient.query(query);

      // エンティティに変換して返す
      return this.mapToEntities(response.elements);
    } catch (error) {
      console.error(`${type}タイプのラーメン店検索エラー:`, error);
      // エラー発生時は空配列を返す（または適切なエラーハンドリング）
      return [];
    }
  }

  /**
   * 指定された境界内のラーメン店を取得（RamenShopRepository実装）
   */
  async findInBounds(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<RamenShop[]> {
    // 境界をバウンディングボックスに変換
    const boundingBox: [number, number, number, number] = [
      bounds.west, // minLon
      bounds.south, // minLat
      bounds.east, // maxLon
      bounds.north, // maxLat
    ];

    return this.findByArea(boundingBox);
  }

  /**
   * API取得データをドメインエンティティに変換
   */
  private mapToEntities(elements: OSMNode[]): RamenShop[] {
    return elements
      .filter((el) => el.lat && el.lon) // 座標があるもののみフィルタリング
      .map((el) => {
        const location = new Location(el.lat, el.lon);
        const name =
          el.tags?.name || el.tags?.["name:ja"] || `店舗 ID: ${el.id}`;

        // タイプの抽出（タグから判断）
        let type = undefined;
        if (el.tags?.["ramen:type"]) {
          type = el.tags["ramen:type"];
        } else if (
          el.tags?.description &&
          typeof el.tags.description === "string"
        ) {
          if (el.tags.description.includes("二郎")) type = "二郎系";
          else if (el.tags.description.includes("家系")) type = "家系";
          // 他のタイプも同様に判断
        }

        // 営業状態
        let isOpen: boolean | undefined = undefined;
        if (el.tags?.opening_hours) {
          if (el.tags.opening_hours === "24/7") {
            isOpen = true;
          } else if (el.tags.opening_hours.includes("closed")) {
            isOpen = false;
          } else {
            isOpen = true; // その他の営業時間情報がある場合は営業中と判断
          }
        }

        return new RamenShop(
          el.id.toString(),
          name,
          location,
          type,
          undefined, // レーティングはOSMデータだけだと取得できないため未定義
          isOpen
        );
      });
  }
}
