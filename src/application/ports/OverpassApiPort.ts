/**
 * Overpass API クライアントのポート
 */
export interface OverpassApiPort {
  /**
   * ラーメン店舗データを取得する
   */
  fetchRamenShops(bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }): Promise<
    {
      id: number;
      type: string;
      lat: number;
      lon: number;
      tags?: {
        [key: string]: string | undefined;
      };
    }[]
  >;
}
