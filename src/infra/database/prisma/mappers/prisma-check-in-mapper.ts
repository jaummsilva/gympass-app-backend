import type { CheckIn as PrismaCheckIn } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CheckIn as DomainCheckIn } from '@/domain/enterprise/check-in'

export class PrismaCheckInMapper {
  static toDomain(raw: PrismaCheckIn): DomainCheckIn {
    return DomainCheckIn.create(
      {
        gym_id: raw.gym_id,
        user_id: raw.user_id,
        created_at: raw.created_at,
        validated_at: raw.validated_at,
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
      validated_at: checkIn.validated_at ? new Date() : null,
    }
  }
}
