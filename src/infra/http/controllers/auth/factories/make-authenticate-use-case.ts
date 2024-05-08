import { AuthenticateUseCase } from '@/domain/application/use-cases/cases/auth/authenticate'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/user/prisma-users-repository'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const bcriptyAdapater = new BcryptAdapter()
  const authenticateUsersCase = new AuthenticateUseCase(
    usersRepository,
    bcriptyAdapater,
  )

  return authenticateUsersCase
}
