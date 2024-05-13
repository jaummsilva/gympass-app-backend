import type { Gym } from '@/domain/enterprise/gym'

export interface GymsRepository {
  findById(gymId: string): Promise<Gym | null>
  create(data: Gym): Promise<Gym>
}
