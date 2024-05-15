import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import { Gym } from '@/domain/enterprise/gym'

interface FetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

type FetchNearbyGymsUseCaseResponse = Either<
  ResourceNotFoundError,
  { gyms: Gym[] }
>

export class FetchNearbyGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    userLatitude,
    userLongitude,
  }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyNearby({
      latitude: userLatitude,
      longitude: userLongitude,
    })

    if (!gyms || gyms.length === 0) {
      return left(new ResourceNotFoundError())
    }

    return right({ gyms })
  }
}
