import { getUseCaseInstances } from "@/application/di/container";
import { NextResponse } from "next/server";

/**
 * タイル座標 (Z/X/Y) を緯度経度のバウンディングボックスに変換
 */
function tile2bbox(
  x: number,
  y: number,
  z: number
): [number, number, number, number] {
  const n = Math.pow(2, z);
  const lon1 = (x / n) * 360 - 180;
  const lat1 =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;
  const lon2 = ((x + 1) / n) * 360 - 180;
  const lat2 =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI;
  return [lon1, lat2, lon2, lat1];
}

export async function GET(
  _request: Request,
  { params }: { params: { z: string; x: string; y: string } }
) {
  try {
    const zNum = Number(params.z);
    const xNum = Number(params.x);
    const yNum = Number(params.y);
    const bbox = tile2bbox(xNum, yNum, zNum);

    // UseCases を取得
    const { getRamenShopsUseCase, getHeatmapDataUseCase } =
      getUseCaseInstances();
    // バウンディングボックス内の店舗を取得
    const shops = await getRamenShopsUseCase.execute(bbox);
    // ドメインサービスでグリッド集約
    const heatmapData = getHeatmapDataUseCase.execute(shops, bbox);

    return NextResponse.json(heatmapData);
  } catch (err) {
    console.error("Tile API error:", err);
    // エラー時は空配列を返す
    return NextResponse.json([]);
  }
}
