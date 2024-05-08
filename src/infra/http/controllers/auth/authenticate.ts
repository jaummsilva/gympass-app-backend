import { InvalidCredentialsError } from '@/core/errors/auth/invalid-credentials-error'
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
    const { email, password } = this.bodyValidation.validate(request.body)

    try {
      const authenticateUsersCase = makeAuthenticateUseCase()

      await authenticateUsersCase.execute({ email, password })
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(409).json({
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(200).send()
  }
}
