import { env } from './infra/env'
import { FastifyAdapter } from './infra/http/fastify/fastify-adapter'
import type { HttpServer } from './infra/http/http-server'
import { AuthRoutes } from './infra/http/routes/auth/routes'
import { UserRoutes } from './infra/http/routes/user/routes'

class App {
  private httpServer: HttpServer
  constructor() {
    this.httpServer = new FastifyAdapter()
  }

  async start() {
    await new AuthRoutes(this.httpServer).init()
    await new UserRoutes(this.httpServer).init()

    this.httpServer.start(env.PORT, () => {
      console.log('HTTP Running!')
    })
  }

  async close() {
    this.httpServer.close()
  }
}

const app = new App()

app.start()
