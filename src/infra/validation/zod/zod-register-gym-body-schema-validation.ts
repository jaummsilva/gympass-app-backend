import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const gymRegisterBodySchema = z.object({
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
  phone: z.string(),
  description: z.string().nullable(),
  title: z.string(),
})

export type GymRegisterBodySchema = z.infer<typeof gymRegisterBodySchema>

export class ZodGymRegisterBodySchemaValidation
  implements Validation<GymRegisterBodySchema>
{
  parse(input: object | undefined) {
    return gymRegisterBodySchema.parse(input)
  }
}
