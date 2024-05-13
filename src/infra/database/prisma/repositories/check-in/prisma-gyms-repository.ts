import type { CheckInsRepository } from '@/domain/application/repositories/check-ins-repository'
import type { CheckIn } from '@/domain/enterprise/check-in'
import { prisma } from '@/infra/database/prisma/prisma'

import { PrismaCheckInMapper } from '../../mappers/prisma-check-in-mapper'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: CheckIn) {
    const checkIn = await prisma.checkIn.create({
      data: {
        id: data.id.toString(),
        created_at: data.created_at ?? new Date(),
        gym_id: data.gym_id,
        user_id: data.user_id,
        validated_at: data.validated_at ? new Date() : null,
      },
    })
    return PrismaCheckInMapper.toDomain(checkIn)
  }
}
