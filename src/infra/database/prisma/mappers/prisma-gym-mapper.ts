import type { Gym as PrismaGym } from '@prisma/client'
import { Decimal } from '@prisma/client/runtime/library'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Gym as DomainGym } from '@/domain/enterprise/gym'

export class PrismaGymMapper {
  static toDomain(raw: PrismaGym): DomainGym {
    return DomainGym.create(
      {
        latitude: PrismaGymMapper.toNumber(raw.latitude),
        longitude: PrismaGymMapper.toNumber(raw.longitude),
        phone: raw.phone,
        title: raw.title,
        description: raw.description ?? '',
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(gym: DomainGym): PrismaGym {
    return {
      id: gym.id.toString(),
      latitude: new Decimal(gym.latitude),
      longitude: new Decimal(gym.longitude),
      phone: gym.phone,
      title: gym.title,
      description: gym.description ?? '',
    }
  }

  private static toNumber(decimal: Decimal): number {
    return Number(decimal.toString())
  }
}
