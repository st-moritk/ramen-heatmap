# 東京ラーメンヒートマップ 設計書

## 1. プロジェクト概要

### 1.1 目的

東京エリアのラーメン店舗分布をヒートマップで可視化し、ラーメン店の密集地帯を把握できるようにする。

### 1.2 主要機能

- 東京エリアのラーメン店舗データの取得と表示
- ヒートマップによる店舗分布の可視化
- 地図のズーム/パン操作
- 店舗数の表示

## 2. アーキテクチャ

### 2.1 クリーンアーキテクチャ

本プロジェクトはクリーンアーキテクチャを採用し、以下の 4 層で構成される：

1. **ドメイン層** (Domain Layer)

   - ビジネスロジックの中核
   - エンティティ、値オブジェクト、ドメインサービス
   - 外部依存なし

2. **アプリケーション層** (Application Layer)

   - ユースケースの実装
   - ドメイン層のコーディネーション
   - 外部とのインターフェース定義

3. **インフラストラクチャ層** (Infrastructure Layer)

   - 外部サービスとの連携
   - リポジトリの実装
   - 技術的詳細の実装

4. **プレゼンテーション層** (Presentation Layer)
   - UI の実装
   - ユーザーインタラクションの処理
   - データの表示

### 2.2 ディレクトリ構造

```
my-next-app/
├─ app/                             ← Presentation 層：Next.js のルーティング
│   ├─ api/                         ← HTTP アダプタ（API Routes）
│   │   └─ <resource>/              ← 例： /api/users, /api/orders…
│   │       └─ route.ts
│   ├─ <page>/                      ← ページ単位のフォルダ
│   │   ├─ layout.tsx               ← そのページ共通レイアウト
│   │   ├─ page.tsx                 ← Server Component エントリ
│   │   ├─ loading.tsx              ← Suspense 用ローディング
│   │   └─ error.tsx                ← エラー時フォールバック
│   ├─ layout.tsx                   ← 全体レイアウト（ナビ／フッター）
│   └─ page.tsx                     ← ルート（/）ページ
│
├─ src/                             ← アプリケーション本体
│   ├─ domain/                      ← ドメイン層（コアビジネスルール）
│   │   ├─ entities/                ← エンティティ定義
│   │   ├─ value-objects/           ← 値オブジェクト
│   │   └─ services/                ← ドメインサービス
│   │
│   ├─ application/                 ← アプリケーション層（ユースケース）
│   │   ├─ ports/                   ← ポート／インターフェース定義
│   │   └─ usecases/               ← ユースケース実装クラス
│   │
│   ├─ infrastructure/              ← インフラ層（技術的実装）
│   │   ├─ repositories/            ← ポート実装（DB, API クライアント）
│   │   ├─ clients/                 ← 外部サービス呼び出しクライアント
│   │   └─ config/                  ← 環境設定（接続先 URL, 認証情報）
│   │
│   └─ presentation/                ← 補助的プレゼンテーションコード
│       ├─ adapters/                ← 内部→外部／外部→内部の変換ロジック
│       ├─ components/              ← React コンポーネント（Client Components）
│       └─ view-models/             ← UI 向けデータ整形ロジック
│
├─ public/                          ← 静的アセット（画像・フォント 等）
├─ styles/                          ← グローバル CSS / Tailwind 設定
├─ next.config.js                   ← Next.js 設定
├─ tsconfig.json                    ← TypeScript 設定
└─ package.json
```

## 3. 技術スタック

### 3.1 フロントエンド

- Next.js 14 (App Router)
- React
- TypeScript
- Tailwind CSS
- Deck.gl (地図表示)
- Mapbox GL JS

### 3.2 バックエンド

- Next.js API Routes
- Overpass API (OpenStreetMap データ取得)

## 4. データフロー

1. ユーザーが地図を表示
2. アプリケーションが Overpass API からラーメン店舗データを取得
3. 取得したデータをヒートマップ形式に変換
4. Deck.gl を使用してヒートマップを表示

## 5. コンポーネント設計

### 5.1 主要コンポーネント

- `RamenHeatmap`: ヒートマップ表示のメインコンポーネント
- `MapView`: 地図表示コンポーネント
- `LoadingIndicator`: ローディング表示
- `ErrorDisplay`: エラー表示

### 5.2 状態管理

- React Hooks を使用
- カスタムフックによるビジネスロジックの分離

## 6. API 設計

### 6.1 Overpass API

- エンドポイント: `https://overpass-api.de/api/interpreter`
- クエリ: 東京エリアのラーメン店舗を取得
- レスポンス形式: GeoJSON

## 7. エラーハンドリング

### 7.1 想定されるエラー

- API 接続エラー
- データ取得エラー
- レンダリングエラー

### 7.2 エラー処理方針

- ユーザーフレンドリーなエラーメッセージ表示
- リトライ機能の実装
- エラーログの記録

## 8. パフォーマンス最適化

### 8.1 キャッシュ戦略

- 店舗データのキャッシュ
- 地図タイルのキャッシュ

### 8.2 レンダリング最適化

- コンポーネントのメモ化
- 遅延ローディング
- 画像の最適化

## 9. セキュリティ

### 9.1 対策

- API キーの環境変数管理
- CORS 設定
- 入力値のバリデーション

## 10. テスト戦略

### 10.1 テスト範囲

- ユニットテスト: ドメインロジック
- コンポーネントテスト: UI コンポーネント
- 統合テスト: API 連携
- E2E テスト: ユーザーフロー

### 10.2 テストツール

- Jest
- React Testing Library
- Cypress
