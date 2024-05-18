import { ZodProfileUpdateBodySchemaValidation } from '@/infra/validation/zod/zod-update-profile-body-schema-validation'

import { ProfileController } from '../../controllers/profile/get-profile'
import { ProfileUpdateController } from '../../controllers/profile/update-profile'
import type { HttpServer } from '../../http-server'

export class ProfileRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const profileController = new ProfileController()

    this.httpServer.register(
      'get',
      '/profile',
      profileController.handle.bind(profileController),
      isPrivateRoute,
    )

    const zodProfileUpdateBodySchemaValidation =
      new ZodProfileUpdateBodySchemaValidation()
    const profileUpdateController = new ProfileUpdateController(
      this.httpServer,
      zodProfileUpdateBodySchemaValidation,
    )

    this.httpServer.register(
      'put',
      '/profile',
      profileUpdateController.handle.bind(profileUpdateController),
      isPrivateRoute,
    )
  }
}
