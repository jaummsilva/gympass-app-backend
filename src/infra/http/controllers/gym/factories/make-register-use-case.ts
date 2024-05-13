import { GymRegisterUseCase } from '@/domain/application/use-cases/cases/gym/register'
import { PrismaGymsRepository } from '@/infra/database/prisma/repositories/gym/prisma-gyms-repository'

export function makeGymRegisterUseCase() {
  const gymRepository = new PrismaGymsRepository()
  const gymsRegisterUsersCase = new GymRegisterUseCase(gymRepository)

  return gymsRegisterUsersCase
}
