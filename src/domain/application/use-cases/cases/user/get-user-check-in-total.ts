import { type Either, left, right } from '@/core/either'
import type { CheckInsRepository } from '@/domain/application/repositories/check-ins-repository'

import { UserHasNotPerfomedCheckInError } from '../../errors/user/user-not-check-ins-reached'

interface GetUserCheckInTotalUseCaseRequest {
  userId: string
}

type GetUserCheckInTotalUseCaseResponse = Either<
  UserHasNotPerfomedCheckInError,
  { total: number }
>

export class GetUserCheckInTotalUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserCheckInTotalUseCaseRequest): Promise<GetUserCheckInTotalUseCaseResponse> {
    const result = await this.checkInsRepository.getCheckInTotalByUserId(userId)

    if (result.total === 0) {
      return left(new UserHasNotPerfomedCheckInError())
    }

    const total = result.total
    return right({ total })
  }
}
