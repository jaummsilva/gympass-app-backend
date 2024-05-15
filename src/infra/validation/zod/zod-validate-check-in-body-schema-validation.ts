import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const validateCheckInBodySchema = z.object({
  checkInId: z.string().uuid(),
})

export type ValidateCheckInBodySchema = z.infer<
  typeof validateCheckInBodySchema
>

export class ZodValidateCheckInBodySchemaValidation
  implements Validation<ValidateCheckInBodySchema>
{
  parse(input: object | undefined) {
    return validateCheckInBodySchema.parse(input)
  }
}
