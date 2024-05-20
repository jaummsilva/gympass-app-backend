import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchGymsUseCase } from './fetch-gyms'
import { GymRegisterUseCase } from './register'

let inMemoryGymsRepository: InMemoryGymsRepository
let gymRegisterUseCase: GymRegisterUseCase
let fetchGymsUseCase: FetchGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    gymRegisterUseCase = new GymRegisterUseCase(inMemoryGymsRepository)
    fetchGymsUseCase = new FetchGymsUseCase(inMemoryGymsRepository)
  })

  it('should be able to fetch gyms', async () => {
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

    const result = await fetchGymsUseCase.execute({
      page: 1,
    })

    expect(result.isRight() && result.value.gyms.length).toBeGreaterThan(0)
  })

  it('should not be able to fetch gyms', async () => {
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

    const result = await fetchGymsUseCase.execute({
      page: 2,
    })

    expect(result.isRight() && result.value.gyms.length).toBe(0)
  })
})
