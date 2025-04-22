import { Location } from "./Location";

/**
 * ラーメン店舗を表すドメインエンティティ
 */
export class RamenShop {
  constructor(
    private readonly _id: string,
    private readonly _name: string,
    private readonly _location: Location
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

  getPosition(): [number, number] {
    return [this._location.longitude, this._location.latitude];
  }
}
