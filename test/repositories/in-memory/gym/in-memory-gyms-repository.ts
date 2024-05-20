import type {
  FindManyNearbyParams,
  FindManyParams,
  GymsRepository,
} from '@/domain/application/repositories/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/domain/application/utils/get-distance-between-coordinates'
import type { MetaResponse } from '@/domain/application/utils/meta-response'
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

  async findManyBySearchName(name: string, page: number) {
    const gyms = this.items
      .filter((item) => item.title.includes(name))
      .slice((page - 1) * 20, page * 20)

    if (gyms.length === 0) {
      return null
    }

    return gyms
  }

  async findManyNearby(params: FindManyNearbyParams) {
    const gyms = this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        { latitude: item.latitude, longitude: item.longitude },
      )

      return distance < 10
    })

    if (gyms.length === 0) {
      return null
    }

    return gyms
  }

  async findMany(params: FindManyParams) {
    const { title = '', page = 1 } = params

    const filteredGyms = this.items.filter((item) => item.title.includes(title))

    const totalCount = filteredGyms.length
    const gyms = filteredGyms.slice((page - 1) * 20, page * 20)

    const meta: MetaResponse = {
      pageIndex: page,
      perPage: 20, // Ajuste conforme necessário
      totalCount,
    }

    return { gyms, meta }
  }
}
