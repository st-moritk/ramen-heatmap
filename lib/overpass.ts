/**
 * Overpass APIから池袋エリアのラーメン店データを取得するクライアント
 */

// 池袋駅の座標
const IKEBUKURO_STATION = {
  lat: 35.7295,
  lon: 139.7109,
};

// 検索範囲（メートル）- 池袋周辺に限定
const SEARCH_RADIUS = 1500; // 小さめの半径でタイムアウトを回避

// 最大リトライ回数
const MAX_RETRIES = 3;

// リトライ間の待機時間（ミリ秒）
const RETRY_DELAY = 3000;

// タイムアウト時間（ミリ秒）
const FETCH_TIMEOUT = 30000;

// ラーメン店を検索するためのOverpass QLクエリ
export const buildOverpassQuery = () => {
  return `
    [out:json][timeout:30];
    (
      node["amenity"="restaurant"]["cuisine"="ramen"](around:${SEARCH_RADIUS},${IKEBUKURO_STATION.lat},${IKEBUKURO_STATION.lon});
      node["shop"="ramen"](around:${SEARCH_RADIUS},${IKEBUKURO_STATION.lat},${IKEBUKURO_STATION.lon});
      way["amenity"="restaurant"]["cuisine"="ramen"](around:${SEARCH_RADIUS},${IKEBUKURO_STATION.lat},${IKEBUKURO_STATION.lon});
      relation["amenity"="restaurant"]["cuisine"="ramen"](around:${SEARCH_RADIUS},${IKEBUKURO_STATION.lat},${IKEBUKURO_STATION.lon});
    );
    out body;
    >;
    out skel qt;
  `;
};

// OpenStreetMapの店舗データの型定義
export interface OSMNode {
  id: number;
  lat: number;
  lon: number;
  tags?: {
    name?: string;
    "name:ja"?: string;
    amenity?: string;
    cuisine?: string;
    shop?: string;
    [key: string]: string | undefined;
  };
}

export interface OverpassResponse {
  elements: OSMNode[];
}

// 地理的な位置データの型定義
export interface GeoPoint {
  position: [number, number]; // [longitude, latitude]
  name?: string;
}

// タイムアウト付きfetch関数
const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout: number
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// リトライ機能付きfetch関数
const fetchWithRetry = async (
  url: string,
  options: RequestInit
): Promise<Response> => {
  let lastError: Error | null = null;

  for (let i = 0; i < MAX_RETRIES; i++) {
    try {
      console.log(`APIリクエスト試行 ${i + 1}/${MAX_RETRIES}...`);
      const response = await fetchWithTimeout(url, options, FETCH_TIMEOUT);
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response;
    } catch (error) {
      console.warn(`リクエスト失敗 (${i + 1}/${MAX_RETRIES}):`, error);
      lastError = error instanceof Error ? error : new Error(String(error));

      // 最後の試行でなければ待機
      if (i < MAX_RETRIES - 1) {
        console.log(`${RETRY_DELAY}ms待機して再試行...`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      }
    }
  }

  throw lastError || new Error("全てのリトライが失敗しました");
};

// モックデータ（APIが完全に失敗した場合のフォールバック）
const MOCK_DATA: GeoPoint[] = [
  { position: [139.7027, 35.7295], name: "サンプルラーメン店1" },
  { position: [139.7109, 35.732], name: "サンプルラーメン店2" },
  { position: [139.72, 35.728], name: "サンプルラーメン店3" },
  { position: [139.715, 35.725], name: "サンプルラーメン店4" },
  { position: [139.708, 35.7265], name: "サンプルラーメン店5" },
  // 必要に応じて追加
];

// Overpass APIからデータを取得する関数
export const fetchRamenShops = async (): Promise<GeoPoint[]> => {
  const query = buildOverpassQuery();
  const overpassUrl = "https://overpass-api.de/api/interpreter";

  try {
    console.log("池袋エリアのラーメン店データを取得中...");
    const response = await fetchWithRetry(overpassUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    const data: OverpassResponse = await response.json();
    console.log(`取得完了: ${data.elements.length}件のラーメン店を発見`);

    // 店舗データを整形
    return data.elements
      .filter((element) => element.lat && element.lon) // 座標がある要素のみフィルタリング
      .map((element) => ({
        position: [element.lon, element.lat] as [number, number],
        name:
          element.tags?.name ||
          element.tags?.["name:ja"] ||
          `店舗 ID: ${element.id}`,
      }));
  } catch (error) {
    console.error("Failed to fetch ramen shops:", error);
    // 開発時にはモックデータを返してUI開発を可能にする
    if (process.env.NODE_ENV === "development") {
      console.warn("API取得失敗のため、モックデータを使用します");
      return MOCK_DATA;
    }
    throw error;
  }
};
