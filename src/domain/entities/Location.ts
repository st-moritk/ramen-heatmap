/**
 * 位置情報を表す値オブジェクト
 */
export class Location {
  constructor(
    private readonly _latitude: number,
    private readonly _longitude: number
  ) {}

  get latitude(): number {
    return this._latitude;
  }

  get longitude(): number {
    return this._longitude;
  }

  /**
   * 別の位置との距離を計算（ハーバーサイン公式）
   * @param other 比較対象の位置
   * @returns 距離（km）
   */
  distanceTo(other: Location): number {
    const R = 6371; // 地球の半径（km）
    const dLat = this.deg2rad(other.latitude - this._latitude);
    const dLon = this.deg2rad(other.longitude - this._longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this._latitude)) *
        Math.cos(this.deg2rad(other.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * 度からラジアンに変換
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * 等価性比較
   */
  equals(other: Location): boolean {
    return (
      this._latitude === other.latitude && this._longitude === other.longitude
    );
  }

  /**
   * 文字列表現
   */
  toString(): string {
    return `[${this._latitude}, ${this._longitude}]`;
  }
}
