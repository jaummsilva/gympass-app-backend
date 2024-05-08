import fastifyCors from '@fastify/cors'
import fastify, {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from 'fastify'

import type { HttpMethods } from '@/core/types/http-methods.js'

import type { HttpRequest } from '../http-request.js'
import type { HttpResponse } from '../http-response.js'
import type { HttpServer } from '../http-server.js'
import { FastifyHttpRequestAdapter } from './fastify-http-request-adapter.js'
import { FastifyHttpResponseAdapter } from './fastify-http-response-adapter.js'

export class FastifyAdapter implements HttpServer {
  app: FastifyInstance

  constructor() {
    this.app = fastify()
  }

  start(port: number, callback: () => void) {
    this.app.register(fastifyCors, {})

    this.app.listen(
      {
        host: '0.0.0.0',
        port,
      },
      callback,
    )
  }

  async close() {
    await this.app.close()
  }

  register(
    method: HttpMethods,
    url: string,
    handler: (
      request: HttpRequest,
      reply: HttpResponse,
    ) => Promise<HttpResponse>,
  ) {
    this.app[method](
      url,
      async (request: FastifyRequest, reply: FastifyReply) => {
        const wrappedRequest = new FastifyHttpRequestAdapter(request)
        const wrappedResponse = new FastifyHttpResponseAdapter(reply)

        return await handler(wrappedRequest, wrappedResponse)
      },
    )
  }
}
