import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const checkInBodySchema = z.object({
  userId: z.string().uuid(),
  gymId: z.string().uuid(),
  userLatitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  userLongitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

export type CheckInBodySchema = z.infer<typeof checkInBodySchema>

export class ZodCheckInBodySchemaValidation
  implements Validation<CheckInBodySchema>
{
  parse(input: object | undefined) {
    return checkInBodySchema.parse(input)
  }
}
