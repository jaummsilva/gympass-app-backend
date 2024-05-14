import type { CheckIn } from '@/domain/enterprise/check-in'

export interface CheckInsRepository {
  create(data: CheckIn): Promise<CheckIn>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[] | null>
  getCheckInTotalByUserId(
    userId: string,
  ): Promise<{ total: number } | { total: 0 }>
}
