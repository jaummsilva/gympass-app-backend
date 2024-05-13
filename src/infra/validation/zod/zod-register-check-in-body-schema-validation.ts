import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const checkInBodySchema = z.object({
  userId: z.string().uuid(),
  gymId: z.string().uuid(),
  userLatitude: z.number(),
  userLongitude: z.number(),
})

export type CheckInBodySchema = z.infer<typeof checkInBodySchema>

export class ZodCheckInBodySchemaValidation
  implements Validation<CheckInBodySchema>
{
  parse(input: object | undefined) {
    return checkInBodySchema.parse(input)
  }
}
