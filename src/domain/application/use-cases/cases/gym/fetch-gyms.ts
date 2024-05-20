import { type Either, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import type { MetaResponse } from '@/domain/application/utils/meta-response'
import { Gym } from '@/domain/enterprise/gym'

interface FetchGymsUseCaseRequest {
  id?: string
  title?: string
  page?: number
}

type FetchGymsUseCaseResponse = Either<
  ResourceNotFoundError,
  { gyms: Gym[]; meta: MetaResponse }
>

export class FetchGymsUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    page,
  }: FetchGymsUseCaseRequest): Promise<FetchGymsUseCaseResponse> {
    const result = await this.gymsRepository.findMany({ page, title })

    const gyms = result.gyms
    const meta = result.meta

    return right({ gyms, meta })
  }
}
