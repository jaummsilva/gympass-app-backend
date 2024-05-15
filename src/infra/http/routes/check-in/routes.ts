import { ZodCheckInBodySchemaValidation } from '@/infra/validation/zod/zod-register-check-in-body-schema-validation'
import { ZodValidateCheckInBodySchemaValidation } from '@/infra/validation/zod/zod-validate-check-in-body-schema-validation'

import { CheckInController } from '../../controllers/check-in/check-in'
import { ValidateCheckInController } from '../../controllers/check-in/validate-check-in'
import type { HttpServer } from '../../http-server'

export class CheckInRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const zodcheckInBodySchemaValidation = new ZodCheckInBodySchemaValidation()
    const checkInController = new CheckInController(
      this.httpServer,
      zodcheckInBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/check-in',
      checkInController.handle.bind(checkInController),
      isPrivateRoute,
    )

    const zodValidatecheckInBodySchemaValidation =
      new ZodValidateCheckInBodySchemaValidation()
    const validateCheckInController = new ValidateCheckInController(
      this.httpServer,
      zodValidatecheckInBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/check-in/validate',
      validateCheckInController.handle.bind(validateCheckInController),
      isPrivateRoute,
    )
  }
}
