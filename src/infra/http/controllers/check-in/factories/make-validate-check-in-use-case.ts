import { ValidateCheckInUseCase } from '@/domain/application/use-cases/cases/check-in/validate-check-in'
import { PrismaCheckInsRepository } from '@/infra/database/prisma/repositories/check-in/prisma-check-ins-repository'

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const validateCheckInCase = new ValidateCheckInUseCase(checkInsRepository)

  return validateCheckInCase
}
