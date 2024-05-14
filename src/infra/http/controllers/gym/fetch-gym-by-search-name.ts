import { fromError } from 'zod-validation-error'

import type { Validation } from '@/core/validation/validation'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeFetchGymBySearchNameUseCase } from './factories/make-fetch-gym-by-search-name-use-case'
import { FetchGymBySearchNamePresenter } from './presenter/user-check-ins-history-presenter'

export class FecthGymBySearchNameController {
  constructor(
    private httpServer: HttpServer,
    private bodyValidation: Validation<{
      name: string
      page?: number
    }>,
  ) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const { name, page } = this.bodyValidation.parse(request.query)

      const fecthGymBySearchNameCase = makeFetchGymBySearchNameUseCase()

      const result = await fecthGymBySearchNameCase.execute({
        name,
        page: page || 0,
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
            ...FetchGymBySearchNamePresenter.toHttp(checkIn),
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
