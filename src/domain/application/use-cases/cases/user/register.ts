import { User } from '@prisma/client'

import type { HashGenerator } from '@/core/cryptography/hash-generator'
import type { UsersRepository } from '@/domain/application/repositories/users-repository'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface UserRegisterUseCaseRequest {
  name: string
  password: string
  email: string
}

interface UserRegisterUseCaseResponse {
  user: User
}

export class UserRegisterUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    password,
    email,
  }: UserRegisterUseCaseRequest): Promise<UserRegisterUseCaseResponse> {
    const passwordHash = await this.hashGenerator.hash(password)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })

    return {
      user,
    }
  }
}
