import { type Either, left, right } from '@/core/either'
import type { CheckInsRepository } from '@/domain/application/repositories/check-ins-repository'
import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import type { UsersRepository } from '@/domain/application/repositories/users-repository'
import { CheckIn } from '@/domain/enterprise/check-in'

import { GymNotExistsError } from '../../errors/gym/gym-not-exists'
import { UserNotExistsError } from '../../errors/user/user-not-exists'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

type CheckInUseCaseResponse = Either<
  UserNotExistsError | GymNotExistsError,
  { checkIn: CheckIn }
>

export class CheckInUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private gymsRepository: GymsRepository,
    private checkInsRepository: CheckInsRepository,
  ) {}

  async execute({
    userId,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError())
    }

    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotExistsError())
    }

    const checkIn = CheckIn.create({ gym_id: gymId, user_id: userId })

    await this.checkInsRepository.create(checkIn)

    return right({ checkIn })
  }
}
