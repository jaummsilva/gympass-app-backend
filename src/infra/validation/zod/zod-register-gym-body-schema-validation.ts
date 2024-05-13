import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const gymRegisterBodySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
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
