import type { FastifyInstance } from 'fastify'

import { authenticate } from './controllers/auth/authenticate'
import { register } from './controllers/user/register'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
}
