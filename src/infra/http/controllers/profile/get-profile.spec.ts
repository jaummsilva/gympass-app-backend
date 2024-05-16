import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'
import { createAndAuthenticateUser } from '../../utils/test/create-and-authenticate-user'

let httpServer: HttpServer

describe('Get Profile (e2e)', () => {
  beforeAll(async () => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should get user profile', async () => {
    const token = await createAndAuthenticateUser(app)

    const result = await request(app.instance.server)
      .get('/profile')
      .set('Authorization', `Bearer ${token}`)

    expect(result.statusCode).toEqual(200)
    expect(result.body.user).toEqual(
      expect.objectContaining({
        email: 'teste@gmail.com',
        name: 'TESTE USER',
      }),
    )
  })
})
