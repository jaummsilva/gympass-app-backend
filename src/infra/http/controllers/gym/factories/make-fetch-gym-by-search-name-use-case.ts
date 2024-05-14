import { FetchGymBySearchNameUseCase } from '@/domain/application/use-cases/cases/gym/fetch-gym-by-search-name'
import { PrismaGymsRepository } from '@/infra/database/prisma/repositories/gym/prisma-gyms-repository'

export function makeFetchGymBySearchNameUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const fetchGymsBySearchNameCase = new FetchGymBySearchNameUseCase(
    gymRepository,
  )

  return fetchGymsBySearchNameCase
}
