import type { Gym as PrismaGym } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Gym as DomainGym } from '@/domain/enterprise/gym'

export class PrismaGymMapper {
  static toDomain(raw: PrismaGym): DomainGym {
    return DomainGym.create(
      {
        latitude: raw.latitude,
        longitude: raw.longitude,
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
      latitude: gym.latitude,
      longitude: gym.longitude,
      phone: gym.phone,
      title: gym.title,
      description: gym.description ?? '',
    }
  }
}
