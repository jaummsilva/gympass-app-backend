import { FetchNearbyGymsUseCase } from '@/domain/application/use-cases/cases/gym/fetch-nearby-gyms'
import { PrismaGymsRepository } from '@/infra/database/prisma/repositories/gym/prisma-gyms-repository'

export function makeFetchNearbyGymsUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const fetchNearbyGymsCase = new FetchNearbyGymsUseCase(gymRepository)

  return fetchNearbyGymsCase
}
