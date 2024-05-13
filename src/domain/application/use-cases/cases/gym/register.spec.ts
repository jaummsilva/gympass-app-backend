import { InMemoryGymsRepository } from 'test/repositories/in-memory/gym/in-memory-gyms-repository'
import { beforeEach, describe, expect, it } from 'vitest'

import { GymRegisterUseCase } from './register'

let inMemoryGymsRepository: InMemoryGymsRepository
let gymRegisterUseCase: GymRegisterUseCase

describe('Gym Register Use Case', () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository()
    gymRegisterUseCase = new GymRegisterUseCase(inMemoryGymsRepository)
  })

  it('should be able to register', async () => {
    const result = await gymRegisterUseCase.execute({
      latitude: -26.3134843,
      longitude: -48.8527979,
      phone: '321321321',
      title: 'Teste',
      description: null, // Passing null for description
    })

    expect(result.isRight() && result.value.gym.id.toString()).toEqual(
      expect.any(String),
    )
  })
})
