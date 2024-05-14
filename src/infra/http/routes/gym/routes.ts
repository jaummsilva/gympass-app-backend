import { ZodFetchGymBySearchNameQuerySchemaValidation } from '@/infra/validation/zod/zod-fetch-gym-by-search-name-query-schema-validation.ts'
import { ZodGymRegisterBodySchemaValidation } from '@/infra/validation/zod/zod-register-gym-body-schema-validation'

import { FecthGymBySearchNameController } from '../../controllers/gym/fetch-gym-by-search-name'
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

    const zodFetchGymBySearchNameQuerySchemaValidation =
      new ZodFetchGymBySearchNameQuerySchemaValidation()
    const fetchGymBySearchNameController = new FecthGymBySearchNameController(
      this.httpServer,
      zodFetchGymBySearchNameQuerySchemaValidation,
    )

    this.httpServer.register(
      'get',
      '/gym/search',
      fetchGymBySearchNameController.handle.bind(
        fetchGymBySearchNameController,
      ),
      isPrivateRoute,
    )
  }
}
