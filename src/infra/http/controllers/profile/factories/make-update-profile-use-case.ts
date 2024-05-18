import { ProfileUpdateUseCase } from '@/domain/application/use-cases/cases/profile/update-profile'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-hasher'
import { PrismaUsersRepository } from '@/infra/database/prisma/repositories/user/prisma-users-repository'

export function makeProfileUpdateUseCase() {
  const ProfileRepository = new PrismaUsersRepository()
  const bcriptyAdapater = new BcryptAdapter()
  const ProfileUpdateProfilesCase = new ProfileUpdateUseCase(
    ProfileRepository,
    bcriptyAdapater,
  )

  return ProfileUpdateProfilesCase
}
