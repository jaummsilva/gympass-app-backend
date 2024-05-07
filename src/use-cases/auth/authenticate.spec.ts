import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { InvalidCredentialsError } from '../errors/auth/invalid-credentials-error'
import { AuthenticateUseCase } from './authenticate'

describe('Authenticate Use Case', () => {
  let inMemoryUsersRepository: InMemoryUsersRepository // Removed duplicated 'UserRepository'

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository() // Fixed typo
  })

  it('should be able to authenticate', async () => {
    const authenticateUseCase = new AuthenticateUseCase(inMemoryUsersRepository)

    await inMemoryUsersRepository.create({
      name: 'teste',
      email: 'teste@gmail.com',
      password_hash: await hash('TESTE123', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'teste@gmail.com',
      password: 'TESTE123',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not  be able to authenticate with wrong email', async () => {
    const authenticateUseCase = new AuthenticateUseCase(inMemoryUsersRepository)

    await expect(
      authenticateUseCase.execute({
        email: 'teste.1@gmail.com',
        password: 'TESTE123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not  be able to authenticate with wrong password', async () => {
    const authenticateUseCase = new AuthenticateUseCase(inMemoryUsersRepository)

    await inMemoryUsersRepository.create({
      name: 'teste',
      email: 'teste5@gmail.com',
      password_hash: await hash('TESTE123', 6),
    })

    await expect(
      authenticateUseCase.execute({
        email: 'teste5@gmail.com',
        password: 'TESTE123312',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
