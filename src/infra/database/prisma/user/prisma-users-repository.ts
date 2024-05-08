import type { Prisma } from '@prisma/client'

import type { UsersRepository } from '@/domain/application/repositories/users-repository'
import { prisma } from '@/infra/database/prisma/prisma'

export class PrismaUsersRepository implements UsersRepository {
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })
    return user
  }

  async findByEmail(email: string) {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })
    return userWithSameEmail
  }
}
