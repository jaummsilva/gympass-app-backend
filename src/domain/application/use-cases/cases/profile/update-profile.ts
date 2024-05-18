import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { type Either, left, right } from '@/core/either'
import type { UsersRepository } from '@/domain/application/repositories/users-repository'
import { User } from '@/domain/enterprise/user'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'
import { UserNotExistsError } from '../../errors/user/user-not-exists'

interface ProfileUpdateUseCaseRequest {
  userId: string
  name: string
  password?: string
  email: string
}

type ProfileUpdateUseCaseResponse = Either<
  UserAlreadyExistsError | UserNotExistsError,
  { updatedUser: User }
>

export class ProfileUpdateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    userId,
    name,
    password,
    email,
  }: ProfileUpdateUseCaseRequest): Promise<ProfileUpdateUseCaseResponse> {
    let passwordHash
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError())
    }

    if (password) {
      passwordHash = await this.hashGenerator.hash(password)
    }

    const userWithSameEmail =
      await this.usersRepository.findByEmailAndExcludeId(email, userId)

    if (userWithSameEmail) {
      return left(new UserAlreadyExistsError())
    }

    user.email = email
    user.name = name
    if (password !== '') {
      user.password_hash = passwordHash!
    }

    const updatedUser = User.create(
      {
        name: user.name,
        email: user.email,
        password_hash: user.password_hash,
        created_at: user.created_at,
        role: user.role,
      },
      user.id,
    )
    await this.usersRepository.update(updatedUser)

    return right({ updatedUser })
  }
}
