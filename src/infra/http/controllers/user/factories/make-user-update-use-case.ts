import { UserUpdateUseCase } from '@/domain/application/use-cases/cases/user/update-user'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeUserUpdateUseCase() {
  const userRepository = new PrismaUsersRepository()
  const bcriptyAdapater = new BcryptAdapter()
  const userUpdateUsersCase = new UserUpdateUseCase(
    userRepository,
    bcriptyAdapater,
  )

  return userUpdateUsersCase
}
