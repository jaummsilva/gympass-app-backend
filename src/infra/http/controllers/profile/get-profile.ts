import { fromError } from 'zod-validation-error'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import { makeGetProfileUseCase } from './factories/make-get-profile-use-case'

export class ProfileController {
  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const getProfileCase = makeGetProfileUseCase()

      const result = await getProfileCase.execute({ userId: request.user.sub })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof ResourceNotFoundError) {
          return reply.status(404).json({
            message: error.message,
          })
        }
      } else {
        return reply.status(200).json({
          user: {
            name: result.value.user.name,
            email: result.value.user.email,
            created_at: result.value.user.created_at,
          },
        })
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.toString(),
      })
    }
  }
}
