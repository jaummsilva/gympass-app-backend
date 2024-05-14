import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory/check-in/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { CheckIn } from '@/domain/enterprise/check-in'
import { Gym } from '@/domain/enterprise/gym'
import { User } from '@/domain/enterprise/user'

import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let hashGenerator: HashGenerator
let fetchUserCheckInsHistoryUseCase: FetchUserCheckInsHistoryUseCase

describe('Fecth User Check Ins History In Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    hashGenerator = new HashAdapter()
    fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
      inMemoryCheckInsRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to fetch check-in history', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const resultUser = await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste@gmail.com',
        password_hash: await hashGenerator.hash('TESTE123'),
      }),
    )
    const userId = resultUser.id.toString()

    const resultGym = await inMemoryGymsRepository.create(
      Gym.create({
        latitude: -27.2092052,
        longitude: -49.6401091,
        phone: '321321321',
        title: 'Teste',
      }),
    )

    const gymId = resultGym.id.toString()

    await inMemoryCheckInsRepository.create(
      CheckIn.create({
        user_id: userId,
        gym_id: gymId,
        created_at: new Date(),
        validated_at: null,
      }),
    )

    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0))

    await inMemoryCheckInsRepository.create(
      CheckIn.create({
        user_id: userId,
        gym_id: gymId,
        created_at: new Date(),
        validated_at: null,
      }),
    )

    const result = await fetchUserCheckInsHistoryUseCase.execute({
      userId,
    })
    expect(result.isRight() && result.value.checkIns.length).toBeGreaterThan(0)
  })
})
