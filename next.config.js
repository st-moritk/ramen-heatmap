/** @type {import('next').NextConfig} */

// GitHub Pagesでサブディレクトリに公開する場合 (例: https://<username>.github.io/<repository-name>)
const repositoryName = "ramen-heatmap";

const nextConfig = {
  /* config options here */
  output: "export", // 静的エクスポートを有効にする

  // GitHub Pagesでサブディレクトリに公開する場合、以下のコメントアウトを解除して設定
  basePath: process.env.NODE_ENV === "production" ? `/${repositoryName}` : "",
  assetPrefix:
    process.env.NODE_ENV === "production" ? `/${repositoryName}/` : "",

  // GitHub Pages デプロイ時に mapbox-gl や maplibre-gl でエラーが出る場合の回避策
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "mapbox-gl": "maplibre-gl",
    };
    return config;
  },
};

module.exports = nextConfig;
