import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory/check-in/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { Gym } from '@/domain/enterprise/gym'
import { User } from '@/domain/enterprise/user'

import { CheckInExpiredError } from '../../errors/check-in/check-in-expired'
import { CheckInUseCase } from './check-in'
import { ValidateCheckInUseCase } from './validate-check-in'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let hashGenerator: HashGenerator
let checkInUseCase: CheckInUseCase
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate Check In Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryGymsRepository = new InMemoryGymsRepository()
    inMemoryCheckInsRepository = new InMemoryCheckInsRepository()
    hashGenerator = new HashAdapter()
    checkInUseCase = new CheckInUseCase(
      inMemoryUsersRepository,
      inMemoryGymsRepository,
      inMemoryCheckInsRepository,
    )

    validateCheckInUseCase = new ValidateCheckInUseCase(
      inMemoryCheckInsRepository,
    )

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate check in', async () => {
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

    const result = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    const checkInId = result.isRight() ? result.value.checkIn.id.toString() : ''

    const checkInValidated = await validateCheckInUseCase.execute({
      checkInId,
    })

    expect(
      checkInValidated.isRight() && checkInValidated.value.checkIn.validated_at,
    ).toEqual(expect.any(Date))
  })

  it('should not be able to validate expired check in', async () => {
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

    const result = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    const checkInId = result.isRight() ? result.value.checkIn.id.toString() : ''

    vi.advanceTimersByTime(3600000 + 1)

    const checkInValidated = await validateCheckInUseCase.execute({
      checkInId,
    })

    expect(checkInValidated.isLeft()).toBeTruthy()
    expect(checkInValidated.value).toBeInstanceOf(CheckInExpiredError)
  })
})
