import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import type { HashComparer } from '@/core/cryptography/hash-comparer'
import type { HashGenerator } from '@/core/cryptography/hash-generator'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'
import { UserRegisterUseCase } from './register'
import { UserUpdateUseCase } from './update-user'

let inMemoryUsersRepository: InMemoryUsersRepository
let userRegisterUseCase: UserRegisterUseCase
let userUpdateUseCase: UserUpdateUseCase
let hashComparer: HashComparer
let hashGenerator: HashGenerator

describe('User Update Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    hashGenerator = new HashAdapter()
    hashComparer = new HashAdapter()
    userRegisterUseCase = new UserRegisterUseCase(
      inMemoryUsersRepository,
      hashGenerator,
    )

    userUpdateUseCase = new UserUpdateUseCase(
      inMemoryUsersRepository,
      hashGenerator,
    )
  })

  it('should be able to update', async () => {
    const result = await userRegisterUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
      name: 'Teste',
      role: 'ADMIN',
    })

    if (result.isRight()) {
      const userId = result.value.user.id.toString()

      const resultUpdate = await userUpdateUseCase.execute({
        email: 'teste@gmail.com',
        name: 'Teste 2',
        userId,
      })

      if (resultUpdate.isRight()) {
        expect(resultUpdate.value.updatedUser.id.toString()).toEqual(
          expect.any(String),
        )
      }
    }
  })

  it('should hash user password upon update', async () => {
    const result = await userRegisterUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
      name: 'Teste',
      role: 'ADMIN',
    })

    if (result.isRight()) {
      const userId = result.value.user.id.toString()

      const resultUpdate = await userUpdateUseCase.execute({
        email: 'teste@gmail.com',
        name: 'Teste 2',
        userId,
        password: 'TESTE12345',
      })

      if (resultUpdate.isRight()) {
        const passwordHash = resultUpdate.value.updatedUser.password_hash

        const isPasswordCorrectlyHashed = await hashComparer.compare(
          'TESTE12345',
          passwordHash.toString(),
        )

        expect(isPasswordCorrectlyHashed).toBe(true)
      }
    }
  })

  it('should not be able to update same email twice', async () => {
    const result = await userRegisterUseCase.execute({
      email: 'teste.10@gmail.com',
      password: 'TESTE123',
      name: 'Teste 5',
      role: 'ADMIN',
    })

    await userRegisterUseCase.execute({
      email: 'differentEmail@gmail.com',
      password: 'TESTE123',
      name: 'Teste',
      role: 'ADMIN',
    })

    if (result.isRight()) {
      const userId = result.value.user.id.toString()

      const duplicateUpdateResult = await userUpdateUseCase.execute({
        email: 'differentEmail@gmail.com',
        name: 'Teste 2',
        userId,
      })

      expect(
        duplicateUpdateResult.isLeft() && duplicateUpdateResult.value,
      ).toBeInstanceOf(UserAlreadyExistsError)
    }
  })
})
