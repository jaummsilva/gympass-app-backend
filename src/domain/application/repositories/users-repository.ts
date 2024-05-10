import type { User } from '@/domain/enterprise/user'

export interface UsersRepository {
  create(data: User): Promise<User>
  findByEmail(email: string): Promise<User | null> // Permitindo retorno nulo
  findById(userId: string): Promise<User | null> // Permitindo retorno nulo
}
