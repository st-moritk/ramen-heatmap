import { GetRamenShopsUseCase } from "@/application/usecases/GetRamenShopsUseCase";
import { OverpassRamenShopRepository } from "@/infrastructure/repositories/OverpassRamenShopRepository";
import { OverpassApiClient } from "@/infrastructure/clients/OverpassApiClient";
import { OverpassApiPort } from "@/application/ports/OverpassApiPort";
import { IRamenShopRepository } from "@/domain/repositories/IRamenShopRepository";

export function getUseCaseInstances() {
  const apiClient: OverpassApiPort = new OverpassApiClient();
  const repository: IRamenShopRepository = new OverpassRamenShopRepository(
    apiClient
  );

  const getRamenShopsUseCase = new GetRamenShopsUseCase(repository);

  return {
    getRamenShopsUseCase,
  };
}
