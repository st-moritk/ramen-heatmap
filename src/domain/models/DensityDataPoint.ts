/**
 * ドメイン層の密度データポイント定義
 */
export interface DensityDataPoint {
  /** グリッドセルの中心座標 [longitude, latitude] */
  position: [number, number];
  /** 店舗数カウント */
  density: number;
}
