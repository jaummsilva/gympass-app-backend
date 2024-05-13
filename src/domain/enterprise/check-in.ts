import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type CheckInProps = {
  user_id: string
  gym_id: string
  created_at?: Date
  validated_at?: Date | null
}

export class CheckIn extends Entity<CheckInProps> {
  private constructor(props: CheckInProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: CheckInProps, id?: UniqueEntityID): CheckIn {
    return new CheckIn(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
        validated_at: props.created_at ? new Date() : null,
      },
      id,
    )
  }

  get user_id() {
    return this.props.user_id
  }

  get gym_id() {
    return this.props.gym_id
  }

  get created_at() {
    return this.props.created_at
  }

  get validated_at() {
    return this.props.validated_at
  }
}
