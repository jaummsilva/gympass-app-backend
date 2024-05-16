import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'
import { createAndAuthenticateUser } from '../../utils/test/create-and-authenticate-user'

let httpServer: HttpServer

describe('Register (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to register', async () => {
    const token = await createAndAuthenticateUser(app)

    const response = await request(app.instance.server)
      .post('/gym')
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -20,
        longitude: -180,
        phone: '123456789',
        description: null,
        title: 'TESTE TITLE',
      })

    expect(response.statusCode).toEqual(201)
  })
})
