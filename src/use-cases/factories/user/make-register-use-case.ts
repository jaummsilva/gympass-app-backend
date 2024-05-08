import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { UserRegisterUseCase } from '@/use-cases/cases/user/register'

export function makeRegisterUseCase() {
  const userRepository = new PrismaUsersRepository()
  const userRegisterUsersCase = new UserRegisterUseCase(userRepository)

  return userRegisterUsersCase
}
