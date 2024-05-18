import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user/user-already-exists'
import { UserNotExistsError } from '@/domain/application/use-cases/errors/user/user-not-exists'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeProfileUpdateUseCase } from './factories/make-update-profile-use-case'

export class ProfileUpdateController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      email: string
      password?: string
      name: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, email, password } = this.bodyValidation.parse(request.body)

      const profileUpdateUsersCase = makeProfileUpdateUseCase()

      const result = await profileUpdateUsersCase.execute({
        userId: request.user.sub,
        name,
        email,
        password,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserAlreadyExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }

        if (error instanceof UserNotExistsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      }

      return reply.status(204).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
