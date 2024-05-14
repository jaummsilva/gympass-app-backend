import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import { Gym } from '@/domain/enterprise/gym'

interface FetchGymBySearchNameUseCaseRequest {
  name: string
  page?: number | 0
}

type FetchGymBySearchNameUseCaseResponse = Either<
  ResourceNotFoundError,
  { gyms: Gym[] }
>

export class FetchGymBySearchNameUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    name,
    page,
  }: FetchGymBySearchNameUseCaseRequest): Promise<FetchGymBySearchNameUseCaseResponse> {
    const gyms = await this.gymsRepository.findManyBySearchName(name, page || 0)

    if (!gyms || gyms.length === 0) {
      return left(new ResourceNotFoundError())
    }

    return right({ gyms })
  }
}
