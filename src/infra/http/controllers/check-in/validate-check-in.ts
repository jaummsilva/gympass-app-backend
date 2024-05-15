import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import type { Validation } from '@/core/validation/validation'
import { CheckInAlreadyValidatedError } from '@/domain/application/use-cases/errors/check-in/check-in-already-validated'
import { CheckInExpiredError } from '@/domain/application/use-cases/errors/check-in/check-in-expired'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeValidateCheckInUseCase } from './factories/make-validate-check-in-use-case'

export class ValidateCheckInController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      checkInId: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { checkInId } = this.bodyValidation.parse(request.body)

      const checkInsCase = makeValidateCheckInUseCase()

      const result = await checkInsCase.execute({
        checkInId,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).json({
            message: error.message,
          })
        }

        if (error instanceof CheckInAlreadyValidatedError) {
          return reply.status(409).json({
            message: error.message,
          })
        }

        if (error instanceof CheckInExpiredError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      } else {
        return reply.status(204).send()
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
