import React from "react";
import RamenHeatmap from "../components/RamenHeatmap";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <header className="w-full max-w-5xl mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">池袋ラーメンヒートマップ</h1>
        <p className="text-gray-600">
          池袋エリアのラーメン店分布をヒートマップで可視化
        </p>
      </header>

      <div className="w-full max-w-5xl">
        <RamenHeatmap initialDataUrl="/api/ramen?mock=true" />
      </div>

      <footer className="w-full max-w-5xl mt-8 text-center text-sm text-gray-500">
        <p>データソース: OpenStreetMap（Overpass API）</p>
        <p>技術スタック: Next.js + deck.gl + react-map-gl</p>
        <p className="mt-2">
          <a
            href="/api/ramen"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            APIエンドポイント
          </a>
          {" | "}
          <a
            href="/api/ramen?mock=true"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            モックデータAPI
          </a>
        </p>
      </footer>
    </main>
  );
}
