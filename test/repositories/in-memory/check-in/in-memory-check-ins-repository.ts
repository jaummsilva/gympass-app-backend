import dayjs from 'dayjs' // Adicionado este import

import type { CheckInsRepository } from '@/domain/application/repositories/check-ins-repository'
import type { CheckIn } from '@/domain/enterprise/check-in'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public items: CheckIn[] = []

  async create(data: CheckIn) {
    this.items.push(data)

    return data
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) {
      return null
    }

    return checkOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    const gyms = this.items
      .filter((item) => item.user_id.toString() === userId)
      .slice((page - 1) * 20, page * 20)

    if (gyms.length === 0) {
      return null
    }

    return gyms
  }

  async getCheckInTotalByUserId(userId: string) {
    const total = this.items.filter(
      (item) => item.user_id.toString() === userId,
    ).length

    return { total }
  }

  async findById(checkInId: string) {
    const check = this.items.find((item) => item.id.toString() === checkInId)

    if (!check) {
      return null
    }

    return check
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }
    return checkIn
  }
}
