import type {
  CheckIn as PrismaCheckIn,
  Gym as PrismaGym,
  User as PrismaUser,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CheckIn as DomainCheckIn } from '@/domain/enterprise/check-in'
import { Gym as DomainGym } from '@/domain/enterprise/gym'
import { User as DomainUser } from '@/domain/enterprise/user'

export class PrismaCheckInMapper {
  static toDomain(
    raw: PrismaCheckIn & { user: PrismaUser; gym: PrismaGym },
  ): DomainCheckIn {
    return DomainCheckIn.create(
      {
        gym_id: raw.gym_id,
        user_id: raw.user_id,
        created_at: raw.created_at,
        validated_at: raw.validated_at ?? null,
        user: DomainUser.create(
          {
            email: raw.user.email,
            password_hash: raw.user.password_hash,
            name: raw.user.name,
            created_at: raw.user.created_at,
          },
          new UniqueEntityID(raw.id),
        ),
        gym: DomainGym.create(
          {
            title: raw.gym.title,
            description: raw.gym.description ?? '',
            phone: raw.gym.phone,
            latitude: raw.gym.latitude.toNumber(),
            longitude: raw.gym.longitude.toNumber(),
          },
          new UniqueEntityID(raw.id),
        ),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(checkIn: DomainCheckIn): PrismaCheckIn {
    return {
      id: checkIn.id.toString(),
      gym_id: checkIn.gym_id,
      user_id: checkIn.user_id,
      created_at: checkIn.created_at ?? new Date(),
      validated_at: checkIn.validated_at ?? null,
    }
  }
}
