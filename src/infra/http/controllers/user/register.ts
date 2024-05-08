import type { Validation } from '@/core/validation/validation'
import { UserAlreadyExistsError } from '@/domain/application/use-cases/errors/user/user-already-exists'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeRegisterUseCase } from './factories/make-register-use-case'

export class UserController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      email: string
      password: string
      name: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    const { name, email, password } = this.bodyValidation.validate(request.body)

    try {
      const userRegisterUsersCase = makeRegisterUseCase()

      await userRegisterUsersCase.execute({ name, email, password })
    } catch (error) {
      if (error instanceof UserAlreadyExistsError) {
        return reply.status(409).json({
          message: error.message,
        })
      }

      throw error
    }

    return reply.status(201).send()
  }
}
