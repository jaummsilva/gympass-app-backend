import type { Gym } from '@/domain/enterprise/gym'

export class GymPresenter {
  static toHttp(gym: Gym): {
    id: string
    title: string
    description?: string | null
    phone: string
    latitude: number
    longitude: number
  } {
    return {
      id: gym.id.toString(),
      latitude: gym.latitude,
      longitude: gym.longitude,
      phone: gym.phone,
      description: gym.description ?? null,
      title: gym.title,
    }
  }
}
