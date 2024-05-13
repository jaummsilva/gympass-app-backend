import { CheckInUseCase } from '@/domain/application/use-cases/cases/check-in/check-in'
import { PrismaCheckInsRepository } from '@/infra/database/prisma/repositories/check-in/prisma-gyms-repository'
import { PrismaGymsRepository } from '@/infra/database/prisma/repositories/gym/prisma-gyms-repository'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeCheckInUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInsRepository = new PrismaCheckInsRepository()
  const checkInCase = new CheckInUseCase(
    usersRepository,
    gymsRepository,
    checkInsRepository,
  )

  return checkInCase
}
