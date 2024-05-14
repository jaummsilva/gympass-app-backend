import type { Gym } from '@/domain/enterprise/gym'

export class FetchGymBySearchNamePresenter {
  static toHttp(gym: Gym): {
    id: string
    title: string
    description?: string
    phone: string
    latitude: number
    longitude: number
  } {
    return {
      id: gym.id.toString(),
      latitude: gym.latitude,
      longitude: gym.longitude,
      phone: gym.phone,
      description: gym.description,
      title: gym.title,
    }
  }
}