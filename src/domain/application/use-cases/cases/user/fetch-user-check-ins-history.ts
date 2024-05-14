import { type Either, left, right } from '@/core/either'
import type { CheckInsRepository } from '@/domain/application/repositories/check-ins-repository'
import { CheckIn } from '@/domain/enterprise/check-in'

import { UserHasNotPerfomedCheckInError } from '../../errors/user/user-not-check-ins-reached'

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
}

type FetchUserCheckInsHistoryUseCaseResponse = Either<
  UserHasNotPerfomedCheckInError,
  { checkIns: CheckIn[] }
>

export class FetchUserCheckInsHistoryUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)

    if (!checkIns || checkIns.length === 0) {
      return left(new UserHasNotPerfomedCheckInError())
    }

    return right({ checkIns })
  }
}
