import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import { prisma } from '@/infra/database/prisma/prisma'

import { PrismaGymMapper } from '../../mappers/prisma-gym-mapper'

export class PrismaGymsRepository implements GymsRepository {
  async findById(gymId: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id: gymId,
      },
    })
    if (!gym) {
      return null
    }
    return PrismaGymMapper.toDomain(gym)
  }
}
