import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeGymRegisterUseCase } from './factories/make-register-use-case'

export class GymController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      latitude: number
      longitude: number
      phone: string | null
      description: string | null
      title: string
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { latitude, longitude, phone, description, title } =
        this.bodyValidation.parse(request.body)

      const gymRegisterUsersCase = makeGymRegisterUseCase()

      await gymRegisterUsersCase.execute({
        description: description !== null ? description : null,
        title,
        latitude,
        longitude,
        phone: phone !== null && phone !== undefined ? phone : '',
      })

      return reply.status(201).send()
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
