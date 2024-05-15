import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeFetchNearbyGymsUseCase } from './factories/make-fetch-nearby-gyms-use-case'
import { GymPresenter } from './presenter/gym-presenter'

export class FecthNearbyGymsController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      userLatitude: number
      userLongitude: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { userLatitude, userLongitude } = this.bodyValidation.parse(
        request.query,
      )

      const fecthNearbyGymsCase = makeFetchNearbyGymsUseCase()

      const result = await fecthNearbyGymsCase.execute({
        userLatitude,
        userLongitude,
      })

      if (result.isLeft()) {
        return reply.status(409).json({
          gyms: [],
        })
      }

      if (result.isRight()) {
        const { gyms } = result.value

        return reply.status(200).json({
          gyms: gyms.map((checkIn) => ({
            ...GymPresenter.toHttp(checkIn),
          })),
        })
      }
    } catch (error) {
      const validationError = fromError(error)

      return reply.status(400).json({
        message: validationError.details,
      })
    }
  }
}
