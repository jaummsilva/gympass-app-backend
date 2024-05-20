import { FetchGymsUseCase } from '@/domain/application/use-cases/cases/gym/fetch-gyms'
import { PrismaGymsRepository } from '@/infra/database/prisma/repositories/gym/prisma-gyms-repository'

export function makeFetchGymsUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const fetchGymsCase = new FetchGymsUseCase(gymRepository)

  return fetchGymsCase
}
