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

    // タイプ判定（ドメインロジック）
    let type: string | undefined;
    if (el.tags?.["ramen:type"]) {
      type = el.tags["ramen:type"];
    } else if (typeof el.tags?.description === "string") {
      if (el.tags.description.includes("二郎")) type = "二郎系";
      else if (el.tags.description.includes("家系")) type = "家系";
    }

    // 営業状態判定（ドメインロジック）
    let isOpen: boolean | undefined;
    if (el.tags?.opening_hours) {
      if (el.tags.opening_hours === "24/7") {
        isOpen = true;
      } else if (el.tags.opening_hours.includes("closed")) {
        isOpen = false;
      } else {
        isOpen = true;
      }
    }

    return new RamenShop(
      el.id.toString(),
      name,
      location,
      type,
      undefined,
      isOpen
    );
  }
}
