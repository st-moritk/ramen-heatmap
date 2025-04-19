import React from "react";
import { RamenHeatmap } from "./presentation/components/RamenHeatmap";

/**
 * Next.jsのメインページコンポーネント
 * プレゼンテーション層のアダプタ
 */
export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">東京ラーメンヒートマップ</h1>
          <p className="mt-2 text-gray-300">
            東京エリアのラーメン店舗分布をヒートマップで可視化
          </p>
        </div>
      </header>

      <main className="flex-grow">
        <RamenHeatmap />
      </main>

      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            データソース:{" "}
            <a href="https://www.openstreetmap.org" className="underline">
              OpenStreetMap
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
