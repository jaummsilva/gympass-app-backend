import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import { Gym } from '@/domain/enterprise/gym'

interface FetchGymsUseCaseRequest {
  id?: string
  title?: string
  page?: number
}

type FetchGymsUseCaseResponse = Either<ResourceNotFoundError, { gyms: Gym[] }>

export class FetchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    id,
    title,
    page,
  }: FetchGymsUseCaseRequest): Promise<FetchGymsUseCaseResponse> {
    const gyms = await this.gymsRepository.findMany({ id, page, title })

    if (!gyms || gyms.length === 0) {
      return left(new ResourceNotFoundError())
    }

    return right({ gyms })
  }
}
