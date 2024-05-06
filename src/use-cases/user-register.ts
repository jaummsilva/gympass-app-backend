import { hash } from 'bcryptjs'

import type { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists'

interface UserRegisterUseCaseRequest {
  name: string
  password: string
  email: string
}

export class UserRegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, password, email }: UserRegisterUseCaseRequest) {
    const passwordHash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash: passwordHash,
    })
  }
}
