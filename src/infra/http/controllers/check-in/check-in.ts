import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'
import { CheckInDistanceBetweenError } from '@/domain/application/use-cases/errors/check-in/check-in-distance-between'
import { CheckInOnSameDateError } from '@/domain/application/use-cases/errors/check-in/check-in-on-same-date'
import { GymNotExistsError } from '@/domain/application/use-cases/errors/gym/gym-not-exists'
import { UserNotExistsError } from '@/domain/application/use-cases/errors/user/user-not-exists'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeCheckInUseCase } from './factories/make-check-in-use-case'

export class CheckInController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      userId: string
      gymId: string
      userLatitude: number
      userLongitude: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { userId, gymId, userLatitude, userLongitude } =
        this.bodyValidation.parse(request.body)

      const checkInsCase = makeCheckInUseCase()

      const result = await checkInsCase.execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserNotExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
        if (error instanceof GymNotExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
        if (error instanceof CheckInOnSameDateError) {
          return reply.status(400).json({
            message: error.message,
          })
        }

        if (error instanceof CheckInDistanceBetweenError) {
          return reply.status(400).json({
            message: error.message,
          })
        }
      } else {
        return reply.status(201).send()
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
