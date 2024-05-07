import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists'
import { UserRegisterUseCase } from './user-register'

describe('Register Use Case', () => {
  let inMemoryUsersRepositoryUserRepository: InMemoryUsersRepository
  beforeEach(() => {
    inMemoryUsersRepositoryUserRepository = new InMemoryUsersRepository()
  })

  it('should be able to register', async () => {
    const userRegisterUseCase = new UserRegisterUseCase(
      inMemoryUsersRepositoryUserRepository,
    )

    const { user } = await userRegisterUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
      name: 'João',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const userRegisterUseCase = new UserRegisterUseCase(
      inMemoryUsersRepositoryUserRepository,
    )

    const { user } = await userRegisterUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
      name: 'João',
    })

    const isPasswordCorrectlyHashed = await compare(
      'TESTE123',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register same email twice', async () => {
    const userRegisterUseCase = new UserRegisterUseCase(
      inMemoryUsersRepositoryUserRepository,
    )

    await userRegisterUseCase.execute({
      email: 'teste.10@gmail.com',
      password: 'TESTE123',
      name: 'João',
    })

    await expect(
      userRegisterUseCase.execute({
        email: 'teste.10@gmail.com',
        password: 'TESTE123',
        name: 'João',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
