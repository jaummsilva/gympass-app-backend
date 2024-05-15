import type {
  FindManyNearbyParams,
  GymsRepository,
} from '@/domain/application/repositories/gyms-repository'
import type { Gym } from '@/domain/enterprise/gym'
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

  async create(data: Gym) {
    const gym = await prisma.gym.create({
      data: {
        latitude: data.latitude,
        longitude: data.longitude,
        phone: data.phone,
        title: data.title,
        id: data.id.toString(),
      },
    })
    return PrismaGymMapper.toDomain(gym)
  }

  async findManyBySearchName(name: string, page: number) {
    let skip = 0
    let take

    if (page !== undefined && page > 0) {
      take = 20
      skip = (page - 1) * take
    }

    const gyms = await prisma.gym.findMany({
      where: {
        OR: [
          {
            title: {
              contains: name.toLowerCase(),
              mode: 'insensitive', // Para fazer a comparação sem diferenciar maiúsculas de minúsculas
            },
          },
        ],
      },
      skip,
      take,
    })

    return gyms.map((gym) => PrismaGymMapper.toDomain(gym))
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const latOffset = 0.09 / 111 // 1 degree latitude ≈ 111 kilometers
    const lonOffset = 0.09 / (111 * Math.cos(params.latitude * (Math.PI / 180))) // 1 degree longitude ≈ 111 km * cos(latitude)

    const gyms = await prisma.gym.findMany({
      where: {
        AND: [
          {
            latitude: {
              gte: params.latitude - latOffset,
              lte: params.latitude + latOffset,
            },
          },
          {
            longitude: {
              gte: params.longitude - lonOffset,
              lte: params.longitude + lonOffset,
            },
          },
        ],
      },
    })

    return gyms.map((gym) => PrismaGymMapper.toDomain(gym))
  }
}
