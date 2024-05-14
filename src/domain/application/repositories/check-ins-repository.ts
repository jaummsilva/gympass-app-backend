import type { CheckIn } from '@/domain/enterprise/check-in'

export interface CheckInsRepository {
  create(data: CheckIn): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string): Promise<CheckIn[] | null>
}
