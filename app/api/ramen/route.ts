import { NextResponse } from "next/server";
import { fetchRamenShops } from "../../../lib/overpass";

// キャッシュ期間（秒）
const CACHE_DURATION = 3600; // 1時間

// モックデータ（開発環境または完全なエラー時に使用）
const MOCK_DATA = [
  { position: [139.7027, 35.7295], name: "サンプルラーメン店1" },
  { position: [139.7109, 35.732], name: "サンプルラーメン店2" },
  { position: [139.72, 35.728], name: "サンプルラーメン店3" },
  { position: [139.715, 35.725], name: "サンプルラーメン店4" },
  { position: [139.708, 35.7265], name: "サンプルラーメン店5" },
];

// インメモリキャッシュ（開発モードでの繰り返しリクエストを防止）
let mockDataCache: NextResponse | null = null;
let realDataCache: NextResponse | null = null;
let lastFetchTime = 0;

/**
 * ラーメン店データを取得するAPI Route
 * GET /api/ramen
 * クエリパラメータ:
 * - mock=true: 開発用モックデータを使用
 */
export async function GET(request: Request) {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const useMock = searchParams.get("mock") === "true";

    // キャッシュ戦略（開発モード時の多重リクエスト防止）
    const now = Date.now();
    const cacheAge = (now - lastFetchTime) / 1000; // 秒単位

    // モックデータが要求された場合
    if (useMock) {
      // キャッシュが存在し、まだ有効期間内であれば使用
      if (mockDataCache && cacheAge < CACHE_DURATION) {
        console.log("キャッシュからモックデータを返します");
        return mockDataCache;
      }

      console.log("新規のモックデータレスポンスを生成します");
      const response = NextResponse.json(
        {
          data: MOCK_DATA,
          count: MOCK_DATA.length,
          timestamp: new Date().toISOString(),
          source: "mock",
          cached: false,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": `s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
          },
        }
      );

      // キャッシュを更新
      mockDataCache = response;
      lastFetchTime = now;

      return response;
    }

    // 実データが要求された場合
    // キャッシュが存在し、まだ有効期間内であれば使用
    if (realDataCache && cacheAge < CACHE_DURATION) {
      console.log("キャッシュから実データを返します");
      return realDataCache;
    }

    // データ取得
    let ramenShops;
    try {
      console.log("池袋エリアのデータ取得を開始します");
      ramenShops = await fetchRamenShops();
    } catch (error) {
      console.error("データ取得エラー:", error);

      // 開発環境の場合はモックデータでフォールバック
      if (process.env.NODE_ENV === "development") {
        console.warn("エラーが発生したため、モックデータを返します");
        ramenShops = MOCK_DATA;
      } else {
        throw error; // 本番環境ではエラーを再スロー
      }
    }

    // データをJSON形式で返す
    const response = NextResponse.json(
      {
        data: ramenShops,
        count: ramenShops.length,
        timestamp: new Date().toISOString(),
        area: "池袋エリア",
        cached: false,
      },
      {
        status: 200,
        headers: {
          // キャッシュヘッダーを設定
          "Cache-Control": `s-maxage=${CACHE_DURATION}, stale-while-revalidate`,
        },
      }
    );

    // キャッシュを更新
    realDataCache = response;
    lastFetchTime = now;

    return response;
  } catch (error) {
    console.error("API route error:", error);

    // エラーレスポンス
    return NextResponse.json(
      {
        error: "ラーメン店データの取得に失敗しました",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
