import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'
import { createAndAuthenticateUser } from '../../utils/test/create-and-authenticate-user'

let httpServer: HttpServer

describe('Update (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to update', async () => {
    const token = await createAndAuthenticateUser(app)

    const responseUpdate = await request(app.instance.server)
      .put('/user')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'TESTE USER',
        email: 'teste@gmail.com',
        password: '',
      })

    expect(responseUpdate.statusCode).toEqual(204)
  })
})
