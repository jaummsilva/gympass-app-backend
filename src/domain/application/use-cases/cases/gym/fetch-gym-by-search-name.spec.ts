import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { FetchGymBySearchUseCase } from './fetch-gym-by-search-name'
import { GymRegisterUseCase } from './register'

let inMemoryGymsRepository: InMemoryGymsRepository
let gymRegisterUseCase: GymRegisterUseCase
let fetchGymBySearchNameUseCase: FetchGymBySearchUseCase

describe('Fetch Gym By Search Name Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    gymRegisterUseCase = new GymRegisterUseCase(inMemoryGymsRepository)
    fetchGymBySearchNameUseCase = new FetchGymBySearchUseCase(
      inMemoryGymsRepository,
    )
  })

  it('should be able to fetch gym by search name', async () => {
    await gymRegisterUseCase.execute({
      latitude: -26.3134843,
      longitude: -48.8527979,
      phone: '321321321',
      title: 'TESTE 3',
      description: null,
    })

    await gymRegisterUseCase.execute({
      latitude: -26.3134843,
      longitude: -48.8527979,
      phone: '321321321',
      title: 'TESTE 2',
      description: null,
    })

    await gymRegisterUseCase.execute({
      latitude: -26.3134843,
      longitude: -48.8527979,
      phone: '321321321',
      title: 'ALEATORIO',
      description: null,
    })

    const result = await fetchGymBySearchNameUseCase.execute({
      name: 'TESTE',
      page: 1,
    })

    expect(result.isRight() && result.value.gyms.length).toBeGreaterThan(0)
  })
})
