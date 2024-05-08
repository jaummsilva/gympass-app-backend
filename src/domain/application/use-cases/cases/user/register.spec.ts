import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import type { HashComparer } from '@/core/cryptography/hash-comparer'
import type { HashGenerator } from '@/core/cryptography/hash-generator'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'
import { UserRegisterUseCase } from './register'

let inMemoryUsersRepositoryUserRepository: InMemoryUsersRepository
let userRegisterUseCase: UserRegisterUseCase
let hashComparer: HashComparer
let hashGenerator: HashGenerator

describe('Register Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepositoryUserRepository = new InMemoryUsersRepository()
    hashGenerator = new HashAdapter()
    hashComparer = new HashAdapter()
    userRegisterUseCase = new UserRegisterUseCase(
      inMemoryUsersRepositoryUserRepository,
      hashGenerator,
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

    const isPasswordCorrectlyHashed = await hashComparer.compare(
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
