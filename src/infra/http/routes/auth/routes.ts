import { ZodAuthenticateBodySchemaValidation } from '@/infra/validation/zod/zod-authenticate-body-schema-validation.ts'

import { AuthenticateController } from '../../controllers/auth/authenticate'
import type { HttpServer } from '../../http-server'

export class AuthRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const zodAuthenticateBodySchemaValidation =
      new ZodAuthenticateBodySchemaValidation()
    const authenticateController = new AuthenticateController(
      this.httpServer,
      zodAuthenticateBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/session',
      authenticateController.handle.bind(authenticateController),
    )
  }
}
