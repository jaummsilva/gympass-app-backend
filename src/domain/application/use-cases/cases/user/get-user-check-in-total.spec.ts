import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory/check-in/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { CheckIn } from '@/domain/enterprise/check-in'
import { Gym } from '@/domain/enterprise/gym'
import { User } from '@/domain/enterprise/user'

import { GetUserCheckInTotalUseCase } from './get-user-check-in-total'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let hashGenerator: HashGenerator
let getUserCheckInCountUseCase: GetUserCheckInTotalUseCase

describe('Get User Check In Count Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    hashGenerator = new HashAdapter()
    getUserCheckInCountUseCase = new GetUserCheckInTotalUseCase(
      inMemoryCheckInsRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to get user check-in count', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    const resultUser = await inMemoryUsersRepository.create(
      User.create({
        name: 'teste',
        email: 'teste@gmail.com',
        password_hash: await hashGenerator.hash('TESTE123'),
        role: 'ADMIN',
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
        gym: resultGym,
        user: resultUser,
      }),
    )

    vi.setSystemTime(new Date(2022, 0, 22, 8, 0, 0))

    await inMemoryCheckInsRepository.create(
      CheckIn.create({
        user_id: userId,
        gym_id: gymId,
        created_at: new Date(),
        validated_at: null,
        gym: resultGym,
        user: resultUser,
      }),
    )

    const result = await getUserCheckInCountUseCase.execute({
      userId,
    })
    expect(result.isRight() && result.value.total).toBe(2)
  })
})
