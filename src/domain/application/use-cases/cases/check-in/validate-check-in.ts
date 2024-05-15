import { type Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { CheckInsRepository } from '@/domain/application/repositories/check-ins-repository'
import { CheckIn } from '@/domain/enterprise/check-in'

import { CheckInAlreadyValidatedError } from '../../errors/check-in/check-in-already-validated'
import { CheckInExpiredError } from '../../errors/check-in/check-in-expired'

interface ValidateCheckInUseCaseRequest {
  checkInId: string
}

type ValidateCheckInUseCaseResponse = Either<
  ResourceNotFoundError | CheckInAlreadyValidatedError | CheckInExpiredError,
  { checkIn: CheckIn }
>

export class ValidateCheckInUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    checkInId,
  }: ValidateCheckInUseCaseRequest): Promise<ValidateCheckInUseCaseResponse> {
    const checkInExists = await this.checkInsRepository.findById(checkInId)

    if (!checkInExists) {
      return left(new ResourceNotFoundError())
    }
    // Verifica se o check-in já foi validado anteriormente
    if (checkInExists.validated_at) {
      return left(new CheckInAlreadyValidatedError())
    }

    const twentyMinutesInMillis = 20 * 60 * 1000
    const currentTime = new Date()
    const checkInCreationTime = checkInExists.created_at.getTime()

    if (currentTime.getTime() - checkInCreationTime > twentyMinutesInMillis) {
      return left(new CheckInExpiredError())
    }

    checkInExists.validated_at = new Date()
    const checkIn = await this.checkInsRepository.save(checkInExists)

    return right({ checkIn })
  }
}
