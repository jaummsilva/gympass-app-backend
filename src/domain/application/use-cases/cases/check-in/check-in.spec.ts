import { afterEach } from 'node:test'

import { HashAdapter } from 'test/cryptography/hash-adapter'
import { InMemoryCheckInsRepository } from 'test/repositories/in-memory/check-in/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { InMemoryUsersRepository } from 'test/repositories/in-memory/user/in-memory-users-repository'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { HashGenerator } from '@/core/cryptography/hash-generator'
import { Gym } from '@/domain/enterprise/gym'
import { User } from '@/domain/enterprise/user'

import { CheckInUseCase } from './check-in'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryCheckInsRepository: InMemoryCheckInsRepository
let inMemoryGymsRepository: InMemoryGymsRepository
let hashGenerator: HashGenerator
let checkInUseCase: CheckInUseCase

describe('Check In Use Case', () => {
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

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to register check in', async () => {
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

    expect(result.isRight() && result.value.checkIn.id.toString()).toEqual(
      expect.any(String),
    )
  })

  it('should not be able to check in twice in the same day', async () => {
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
        latitude: -26.3134843,
        longitude: -48.8527979,
        phone: '321321321',
        title: 'Teste',
      }),
    )

    const gymId = resultGym.id.toString()

    await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -26.3134843,
      userLongitude: -48.8527979,
    })

    const result = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -26.3134843,
      userLongitude: -48.8527979,
    })

    expect(result.isLeft()).toBeTruthy()
  })

  it('should be able to check in twice but in different days', async () => {
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
        latitude: -26.3134843,
        longitude: -48.8527979,
        phone: '321321321',
        title: 'Teste',
      }),
    )

    const gymId = resultGym.id.toString()

    await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -26.3134843,
      userLongitude: -48.8527979,
    })

    vi.setSystemTime(new Date(2022, 0, 11, 8, 0, 0))

    const result = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -26.3134843,
      userLongitude: -48.8527979,
    })

    expect(result.isRight() && result.value.checkIn.id.toString()).toEqual(
      expect.any(String),
    )
  })

  it('should not be able to check in on distant gym', async () => {
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
        latitude: -26.3134843,
        longitude: -48.8527979,
        phone: '321321321',
        title: 'Teste',
      }),
    )

    const gymId = resultGym.id.toString()

    const result = await checkInUseCase.execute({
      userId,
      gymId,
      userLatitude: -26.3122915,
      userLongitude: -48.8550984,
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
