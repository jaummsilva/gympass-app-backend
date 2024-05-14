import { fromError } from 'zod-validation-error'

import { UserHasNotPerfomedCheckInError } from '@/domain/application/use-cases/errors/user/user-not-check-ins-reached'

import type { HttpRequest } from '../../http-request'
import type { HttpResponse } from '../../http-response'
import type { HttpServer } from '../../http-server'
import { makeFetchUserCheckInsHistoryUseCase } from './factories/make-fetch-user-check-ins-history-use-case'
import { UserCheckInsHistoryPresenter } from './presenter/user-check-ins-history-presenter'

export class FecthUserCheckInsHistoryController {
  constructor(private httpServer: HttpServer) {}

  async handle(request: HttpRequest, reply: HttpResponse) {
    try {
      const fecthUserCheckInsHistoryCase = makeFetchUserCheckInsHistoryUseCase()

      const result = await fecthUserCheckInsHistoryCase.execute({
        userId: request.user.sub,
      })

      if (result.isLeft()) {
        const error = result.value

        if (error instanceof UserHasNotPerfomedCheckInError) {
          return reply.status(409).json({
            message: error.message,
          })
        }
      }

      if (result.isRight()) {
        const { checkIns } = result.value

        return reply.status(200).json({
          checkIns: checkIns.map((checkIn) => ({
            ...UserCheckInsHistoryPresenter.toHttp(checkIn),
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
