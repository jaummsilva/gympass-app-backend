import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeFetchGymsUseCase } from './factories/make-fetch-gyms-use-case'
import { GymPresenter } from './presenter/gym-presenter'

export class FecthGymsController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      id?: string
      title?: string
      page?: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { id, title, page } = this.bodyValidation.parse(request.query)

      const fecthGymsCase = makeFetchGymsUseCase()

      const result = await fecthGymsCase.execute({ id, title, page })

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
