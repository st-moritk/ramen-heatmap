import { GetRamenShopsUseCase } from "@/application/usecases/GetRamenShopsUseCase";
import { GetHeatmapDataUseCase } from "@/application/usecases/GetHeatmapDataUseCase";
import { RamenDensityService } from "@/domain/services/RamenDensityService";
import { OverpassRamenShopRepository } from "@/infrastructure/repositories/OverpassRamenShopRepository";
import { OverpassApiClient } from "@/infrastructure/clients/OverpassApiClient";
import { OverpassApiPort } from "@/application/ports/OverpassApiPort";
import { IRamenShopRepository } from "@/domain/repositories/IRamenShopRepository";
import { RamenDensityServicePort } from "@/application/ports/RamenDensityServicePort";

export function getUseCaseInstances() {
  const apiClient: OverpassApiPort = new OverpassApiClient();
  const repository: IRamenShopRepository = new OverpassRamenShopRepository(
    apiClient
  );
  const densityService: RamenDensityServicePort = new RamenDensityService();

  const getRamenShopsUseCase = new GetRamenShopsUseCase(repository);
  const getHeatmapDataUseCase = new GetHeatmapDataUseCase(densityService);

  return {
    getRamenShopsUseCase,
    getHeatmapDataUseCase,
    mapboxAccessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "",
  };
}


