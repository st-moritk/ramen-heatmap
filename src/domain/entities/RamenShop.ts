import { Location } from "./Location";

/**
 * ラーメン店舗を表すドメインエンティティ
 */
export class RamenShop {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _location: Location,
    private readonly _type?: string,
    private readonly _rating?: number,
    private readonly _isOpen?: boolean
  ) {}

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get location(): Location {
    return this._location;
  }

  get type(): string | undefined {
    return this._type;
  }

  get rating(): number | undefined {
    return this._rating;
  }

  get isOpen(): boolean | undefined {
    return this._isOpen;
  }

  getPosition(): [number, number] {
    return [this._location.longitude, this._location.latitude];
  }

  /**
   * 店舗が指定されたタイプかどうかを判定
   */
  isOfType(type: string): boolean {
    return this._type === type;
  }

  /**
   * 店舗の評価を取得
   */
  getRating(): number {
    return this._rating ?? 0;
  }

  /**
   * 店舗が営業中かどうかを判定
   */
  getIsOpen(): boolean {
    return this._isOpen ?? false;
  }

  /**
   * ジオJSON形式に変換
   */
  toGeoJson() {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [this._location.longitude, this._location.latitude],
      },
      properties: {
        id: this._id,
        name: this._name,
        type: this._type,
        rating: this._rating,
      },
    };
  }
}
