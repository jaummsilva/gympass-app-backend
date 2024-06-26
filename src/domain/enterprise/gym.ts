import { Entity } from '@/core/entities/entity'
import type { UniqueEntityID } from '@/core/entities/unique-entity-id'

type GymProps = {
  title: string
  description?: string | null
  phone: string
  latitude: number
  longitude: number
  totalCheckIns: number
}

export class Gym extends Entity<GymProps> {
  private constructor(props: GymProps, id?: UniqueEntityID) {
    super(props, id)
  }

  static create(props: GymProps, id?: UniqueEntityID): Gym {
    return new Gym(props, id)
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get phone() {
    return this.props.phone
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  get totalCheckIns() {
    return this.props.totalCheckIns
  }
}
