import { ZodUserRegisterBodySchemaValidation } from '@/infra/validation/zod/zod-register-user-body-schema-validation'

import { FecthUserCheckInsHistoryController } from '../../controllers/user/fetch-user-check-ins-historys'
import { GetUserCheckInTotalController } from '../../controllers/user/get-user-check-in-total'
import { UserController } from '../../controllers/user/register'
import type { HttpServer } from '../../http-server'

export class UserRoutes {
  constructor(private httpServer: HttpServer) {}

  async init() {
    const isPrivateRoute = true
    const zodUserRegisterBodySchemaValidation =
      new ZodUserRegisterBodySchemaValidation()
    const userController = new UserController(
      this.httpServer,
      zodUserRegisterBodySchemaValidation,
    )

    this.httpServer.register(
      'post',
      '/user',
      userController.handle.bind(userController),
    )

    const fetchUserCheckInsHistoryController =
      new FecthUserCheckInsHistoryController(this.httpServer)

    this.httpServer.register(
      'get',
      '/user/check-ins-history',
      fetchUserCheckInsHistoryController.handle.bind(
        fetchUserCheckInsHistoryController,
      ),
      isPrivateRoute,
    )

    const getUserCheckInTotalController = new GetUserCheckInTotalController(
      this.httpServer,
    )

    this.httpServer.register(
      'get',
      '/user/check-in-total',
      getUserCheckInTotalController.handle.bind(getUserCheckInTotalController),
      isPrivateRoute,
    )
  }
}
