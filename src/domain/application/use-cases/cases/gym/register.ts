import { type Either, right } from '@/core/either'
import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import { Gym } from '@/domain/enterprise/gym'

import { UserAlreadyExistsError } from '../../errors/user/user-already-exists'

interface GymRegisterUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

type GymRegisterUseCaseResponse = Either<UserAlreadyExistsError, { gym: Gym }>

export class GymRegisterUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    phone,
    latitude,
    longitude,
  }: GymRegisterUseCaseRequest): Promise<GymRegisterUseCaseResponse> {
    const gym = Gym.create({
      description: description !== null ? description : undefined,
      title,
      latitude,
      longitude,
      phone: phone !== null && phone !== undefined ? phone : '',
    })

    await this.gymsRepository.create(gym)

    return right({ gym })
  }
}
