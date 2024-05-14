import { type Either, left, right } from '@/core/either'
import type { CheckInsRepository } from '@/domain/application/repositories/check-ins-repository'
import type { GymsRepository } from '@/domain/application/repositories/gyms-repository'
import type { UsersRepository } from '@/domain/application/repositories/users-repository'
import { getDistanceBetweenCoordinates } from '@/domain/application/utils/get-distance-between-coordinates'
import { CheckIn } from '@/domain/enterprise/check-in'

import { CheckInDistanceBetweenError } from '../../errors/check-in/check-in-distance-between'
import { CheckInOnSameDateError } from '../../errors/check-in/check-in-on-same-date'
import { GymNotExistsError } from '../../errors/gym/gym-not-exists'
import { UserNotExistsError } from '../../errors/user/user-not-exists'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

type CheckInUseCaseResponse = Either<
  | UserNotExistsError
  | GymNotExistsError
  | CheckInOnSameDateError
  | CheckInDistanceBetweenError,
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
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotExistsError())
    }

    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      return left(new GymNotExistsError())
    }

    // calculate distance betweenuser and gym
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      { latitude: gym.latitude, longitude: gym.longitude },
    )
    const MAX_DISTANCE = 0.1

    if (distance > MAX_DISTANCE) {
      return left(new CheckInDistanceBetweenError())
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      return left(new CheckInOnSameDateError())
    }

    const checkIn = CheckIn.create({
      gym_id: gymId,
      user_id: userId,
      validated_at: null,
      created_at: new Date(),
    })

    await this.checkInsRepository.create(checkIn)

    return right({ checkIn })
  }
}
