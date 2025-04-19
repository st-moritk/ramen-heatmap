import { GetRamenShopsUseCase } from "@/application/usecases/GetRamenShopsUseCase";
import { GetHeatmapDataUseCase } from "@/application/usecases/GetHeatmapDataUseCase";
import { RamenDensityService } from "@/domain/services/RamenDensityService";
import { OverpassRamenShopRepository } from "@/infrastructure/repositories/OverpassRamenShopRepository";
import { OverpassApiClient } from "@/infrastructure/clients/OverpassApiClient";
import { OverpassApiPort } from "@/application/ports/OverpassApiPort";
import { IRamenShopRepository } from "@/domain/repositories/IRamenShopRepository";
import { RamenDensityServicePort } from "@/application/ports/RamenDensityServicePort";

/**
 * アプリケーション層のユースケースインスタンスを提供する
 * 依存性注入のコンテナとして機能し、プレゼンテーション層とインフラ層の結合度を低減する
 */
export function getUseCaseInstances() {
  // インターフェースの実装を作成
  const apiClient: OverpassApiPort = new OverpassApiClient();
  const repository: IRamenShopRepository = new OverpassRamenShopRepository(
    apiClient
  );
  const densityService: RamenDensityServicePort = new RamenDensityService();

  // ユースケースを作成
  const getRamenShopsUseCase = new GetRamenShopsUseCase(repository);
  const getHeatmapDataUseCase = new GetHeatmapDataUseCase(densityService);

  return {
    getRamenShopsUseCase,
    getHeatmapDataUseCase,
    // 環境変数からMapboxアクセストークンを注入
    mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
  };
}
