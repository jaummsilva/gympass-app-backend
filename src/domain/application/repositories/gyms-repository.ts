import type { Gym } from '@/domain/enterprise/gym'

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>
  create(data: Gym): Promise<Gym>
  findManyBySearchName(name: string, page: number): Promise<Gym[] | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[] | null>
}
