"use client";

import { GetRamenShopsUseCase } from "@/application/usecases/GetRamenShopsUseCase";
import { GetHeatmapDataUseCase } from "@/application/usecases/GetHeatmapDataUseCase";
import { RamenDensityService } from "@/domain/services/RamenDensityService";
import { OverpassRamenShopRepository } from "@/infrastructure/repositories/OverpassRamenShopRepository";
import { OverpassApiClient } from "@/infrastructure/clients/OverpassApiClient";

/**
 * アプリケーション層のユースケースインスタンスを提供する
 * 依存性注入のコンテナとして機能し、プレゼンテーション層とインフラ層の結合度を低減する
 */
export function getUseCaseInstances() {
  // インフラ層のインスタンスを作成
  const apiClient = new OverpassApiClient();
  const repository = new OverpassRamenShopRepository(apiClient);

  // ドメイン層のインスタンスを作成
  const densityService = new RamenDensityService();

  // アプリケーション層のユースケースを作成
  const getRamenShopsUseCase = new GetRamenShopsUseCase(repository);
  const getHeatmapDataUseCase = new GetHeatmapDataUseCase(densityService);

  // ユースケースをオブジェクトとして返す
  return {
    getRamenShopsUseCase,
    getHeatmapDataUseCase,
  };
}
