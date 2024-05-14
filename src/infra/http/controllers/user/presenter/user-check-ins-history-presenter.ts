import type { CheckIn } from '@/domain/enterprise/check-in'

export class UserCheckInsHistoryPresenter {
  static toHttp(checkIn: CheckIn): {
    gym_title: string
    created_at: Date
    validated_at: Date | null
  } {
    return {
      gym_title: checkIn.gym.title,
      created_at: checkIn.created_at,
      validated_at: checkIn.validated_at,
    }
  }
}
