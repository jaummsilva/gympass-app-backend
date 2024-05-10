import type { User } from '@/domain/enterprise/user'

export class ProfilePresenter {
  static toHttp(user: User): {
    name: string
    email: string
  } {
    return {
      name: user.name,
      email: user.email,
    }
  }
}
