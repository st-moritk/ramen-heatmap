# 東京ラーメンヒートマップ

東京エリアのラーメン店舗分布をヒートマップで可視化する Web アプリケーション。

## 概要

このプロジェクトは、OpenStreetMap のデータを使用して東京都内のラーメン店の密度をヒートマップで表示します。
Next.js と deck.gl を組み合わせた地理空間データの可視化の実装例です。

![スクリーンショット](./screenshot.png)

## 技術スタック

- **フロントエンド**

  - Next.js
  - TypeScript
  - deck.gl (WebGL ベースの地理空間可視化ライブラリ)
  - react-map-gl (Mapbox のラッパー)

- **バックエンド**
  - Next.js API Routes
  - OpenStreetMap (Overpass API)

## セットアップ

### 前提条件

- Node.js 16.8.0 以上
- Mapbox API キー (無料で取得可能: https://account.mapbox.com/)

### インストール

1. リポジトリをクローン

```bash
git clone https://github.com/yourusername/ramen-heatmap.git
cd ramen-heatmap
```

2. 依存パッケージをインストール

```bash
npm install
# または
yarn
```

3. 環境変数の設定
   `.env.example`ファイルをコピーして`.env.local`を作成し、Mapbox API キーを設定します：

```bash
cp .env.example .env.local
```

`.env.local`ファイルを編集して Mapbox API キーを設定：

```
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで http://localhost:3000 にアクセスすると、アプリケーションが表示されます。

## 主な機能

- 東京エリアのラーメン店分布をヒートマップで可視化
- 23 区別のデータ取得オプション
- ズームレベルに応じたポイント表示切替
- API Route によるデータ取得とキャッシュ
- レスポンシブな UI

## API エンドポイント

- `/api/ramen` - 東京全体のラーメン店データを一度に取得
- `/api/ramen?method=byWard` - 23 区ごとに分割してデータを取得（大量データ対策）

## 考慮点

- 東京全域のデータが多い場合は、23 区ごとのデータ取得方法を使用
- Overpass API のタイムアウトが発生する場合は、検索半径を縮小

## ライセンス

MIT

## 謝辞

- データ: © OpenStreetMap contributors
- 可視化: deck.gl & react-map-gl
- マップ: © Mapbox
