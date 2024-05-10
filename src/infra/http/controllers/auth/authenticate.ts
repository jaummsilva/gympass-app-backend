import { fromError } from 'zod-validation-error'

import { InvalidCredentialsError } from '@/core/errors/invalid-credentials-error'
import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeAuthenticateUseCase } from './factories/make-authenticate-use-case'

export class AuthenticateController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      email: string
      password: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { email, password } = this.bodyValidation.validate(request.body)

      const authenticateUsersCase = makeAuthenticateUseCase()

      const result = await authenticateUsersCase.execute({ email, password })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof InvalidCredentialsError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      } else {
        const { user } = result.value

        const { token } = this.httpServer.signJwt(user.id.toString())

        return reply.status(200).json({ token })
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.toString(),
      })
    }
  }
}
