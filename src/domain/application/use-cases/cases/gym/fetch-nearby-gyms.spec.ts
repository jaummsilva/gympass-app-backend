import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'
import { GymRegisterUseCase } from './register'

let inMemoryGymsRepository: InMemoryGymsRepository
let gymRegisterUseCase: GymRegisterUseCase
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    gymRegisterUseCase = new GymRegisterUseCase(inMemoryGymsRepository)
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(inMemoryGymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymRegisterUseCase.execute({
      latitude: -21.3134843,
      longitude: -43.8527979,
      phone: '321321321',
      title: 'TESTE 3',
      description: null,
    })

    await gymRegisterUseCase.execute({
      latitude: -23.3134843,
      longitude: -45.8527979,
      phone: '321321321',
      title: 'TESTE 2',
      description: null,
    })

    await gymRegisterUseCase.execute({
      latitude: -26.3134841,
      longitude: -48.8527973,
      phone: '321321321',
      title: 'ALEATORIO',
      description: null,
    })

    const result = await fetchNearbyGymsUseCase.execute({
      userLatitude: -26.3134843,
      userLongitude: -48.8527979,
    })

    expect(result.isRight() && result.value.gyms.length).toBeGreaterThan(0)
  })

  it('should not be able to fetch nearby gyms', async () => {
    await gymRegisterUseCase.execute({
      latitude: -21.3134843,
      longitude: -43.8527979,
      phone: '321321321',
      title: 'TESTE 3',
      description: null,
    })

    await gymRegisterUseCase.execute({
      latitude: -23.3134843,
      longitude: -45.8527979,
      phone: '321321321',
      title: 'TESTE 2',
      description: null,
    })

    await gymRegisterUseCase.execute({
      latitude: -26.3134841,
      longitude: -48.8527973,
      phone: '321321321',
      title: 'ALEATORIO',
      description: null,
    })

    const result = await fetchNearbyGymsUseCase.execute({
      userLatitude: -26.3134843,
      userLongitude: -43.8527979,
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
