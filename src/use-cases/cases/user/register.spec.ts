import { compare } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'
import { UserRegisterUseCase } from './register'

let inMemoryUsersRepositoryUserRepository: InMemoryUsersRepository
let userRegisterUseCase: UserRegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepositoryUserRepository = new InMemoryUsersRepository()
    userRegisterUseCase = new UserRegisterUseCase(
      inMemoryUsersRepositoryUserRepository,
    )
  })

  it('should be able to register', async () => {
    const { user } = await userRegisterUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
      name: 'João',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
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
