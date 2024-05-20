import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import type { Gym } from '@/domain/enterprise/gym'
import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'
import { createAndAuthenticateUser } from '../../utils/test/create-and-authenticate-user'

let httpServer: HttpServer

describe('Fetch gyms (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to fetch gyms', async () => {
    const token = await createAndAuthenticateUser(app)

    await request(app.instance.server)
      .post('/gym')
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -20,
        longitude: -180,
        phone: '123456789',
        description: null,
        title: 'TESTE TITLE',
      })

    const gym = await prisma.gym.findFirst({
      select: {
        title: true,
      },
    })

    const response = await request(app.instance.server)
      .get('/gym')
      .set('Authorization', `Bearer ${token}`)
      .query({
        title: gym?.title,
      })

    const responseBody: {
      gyms: Gym[]
    } = response.body

    expect(response.statusCode).toEqual(200)
    expect(responseBody.gyms.length).toBe(1)
  })
})
