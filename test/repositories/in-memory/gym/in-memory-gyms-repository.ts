import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import type { Gym } from '@/domain/enterprise/gym'

export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  async create(data: Gym) {
    this.items.push(data)

    return data
  }

  async findById(gymId: string) {
    const gym = this.items.find((item) => item.id.toString() === gymId)

    if (!gym) {
      return null
    }

    return gym
  }
}
