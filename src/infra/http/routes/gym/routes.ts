import { ZodGymRegisterBodySchemaValidation } from '@/infra/validation/zod/zod-register-gym-body-schema-validation'

import { GymController } from '../../controllers/gym/register'
import type { HttpServer } from '../../http-server'

export class GymRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const zodGymRegisterBodySchemaValidation =
      new ZodGymRegisterBodySchemaValidation()
    const gymController = new GymController(
      this.httpServer,
      zodGymRegisterBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/gym',
      gymController.handle.bind(gymController),
      isPrivateRoute,
    )
  }
}
