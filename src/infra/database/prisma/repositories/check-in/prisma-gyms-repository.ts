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

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = new Date(date)
    startOfTheDay.setHours(0, 0, 0, 0)

    const endOfTheDay = new Date(date)
    endOfTheDay.setHours(23, 59, 59, 999)

    const checkOnSameDate = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay,
          lte: endOfTheDay,
        },
      },
    })

    if (!checkOnSameDate) {
      return null
    }
    return PrismaCheckInMapper.toDomain(checkOnSameDate)
  }
}
