import { RamenShop } from "../entities/RamenShop";
import { Location } from "../entities/Location";

/**
 * OSM から取得した生データを RamenShop ドメインエンティティに変換するファクトリ
 */
export class RamenShopFactory {
  static createFromOSM(el: {
    id: number;
    lat: number;
    lon: number;
    tags?: Record<string, string | undefined>;
  }): RamenShop {
    const location = new Location(el.lat, el.lon);
    const name = el.tags?.name || el.tags?.["name:ja"] || `店舗 ID: ${el.id}`;

    // ratingと営業状態は不要のため削除
    return new RamenShop(el.id.toString(), name, location);
  }
}
