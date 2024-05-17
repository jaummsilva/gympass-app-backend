import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { prisma } from '@/infra/database/prisma/prisma'
import { app } from '@/main'

import { FastifyAdapter } from '../../fastify/fastify-adapter'
import type { HttpServer } from '../../http-server'
import { createAndAuthenticateUser } from '../../utils/test/create-and-authenticate-user'

let httpServer: HttpServer

describe('Check-In Register (e2e)', () => {
  beforeAll(() => {
    httpServer = new FastifyAdapter()
  })

  afterAll(() => {
    httpServer.close()
  })

  it('should be able to register', async () => {
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
        id: true,
      },
    })

    const response = await request(app.instance.server)
      .post('/check-in')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userLatitude: -20,
        userLongitude: -180,
        gymId: gym?.id,
      })

    expect(response.statusCode).toEqual(201)
  })
})
