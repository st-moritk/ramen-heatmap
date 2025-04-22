import { OverpassApiPort } from "../../application/ports/OverpassApiPort";

/**
 * OpenStreetMapのノード型
 */
export interface OSMNode {
  id: number;
  type: string;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    "name:ja"?: string;
    cuisine?: string;
    amenity?: string;
    description?: string;
    opening_hours?: string;
    [key: string]: string | undefined;
  };
}

/**
 * Overpass APIのレスポンス型
 */
export interface OverpassResponse {
  elements: OSMNode[];
}

/**
 * Overpass APIクライアント
 */
export class OverpassApiClient implements OverpassApiPort {
  private readonly baseUrl = "https://overpass-api.de/api/interpreter";

  /**
   * クエリを実行してデータを取得
   * @param query Overpass QLクエリ
   */
  async query(query: string): Promise<OverpassResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        body: query,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      if (!response.ok) {
        console.warn(`Overpass API error response: ${response.statusText}`);
        return { elements: [] };
      }

      return await response.json();
    } catch (error) {
      console.warn("Overpass API request failed:", error);
      return { elements: [] };
    }
  }

  /**
   * 指定されたエリア内のラーメン店を取得
   */
  async fetchRamenShops(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<OSMNode[]> {
    const boundingBox: [number, number, number, number] = [
      bounds.west,
      bounds.south,
      bounds.east,
      bounds.north,
    ];
    const query = this.buildRamenQuery(boundingBox);
    const response = await this.query(query);
    return response.elements;
  }

  /**
   * 指定されたエリア内のラーメン店を取得するクエリを構築
   * @param boundingBox エリアの境界ボックス [minLon, minLat, maxLon, maxLat]
   */
  buildRamenQuery(boundingBox: [number, number, number, number]): string {
    const [minLon, minLat, maxLon, maxLat] = boundingBox;
    return `
      [out:json][timeout:25];
      (
        node["amenity"="restaurant"]["cuisine"="ramen"](${minLat},${minLon},${maxLat},${maxLon});
        node["shop"="ramen"](${minLat},${minLon},${maxLat},${maxLon});
      );
      out body;
    `;
  }
}
