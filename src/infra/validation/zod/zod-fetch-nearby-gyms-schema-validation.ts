import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const fetchNearbyGymsQuerySchema = z.object({
  userLatitude: z
    .string()
    .transform((val) => (val ? parseFloat(val) : 0))
    .refine((value) => {
      return Math.abs(value) <= 90
    }), // Transforme em número e substitua undefined por 0
  userLongitude: z
    .string()
    .transform((val) => (val ? parseFloat(val) : 0))
    .refine((value) => {
      return Math.abs(value) <= 180
    }), // Transforme em número e substitua undefined por 0
})

// Defina o tipo inferido do esquema de validação
export type FetchNearbyGymsQuerySchema = z.infer<
  typeof fetchNearbyGymsQuerySchema
>

// Implemente a validação
export class ZodFetchNearbyGymsQuerySchemaValidation
  implements Validation<FetchNearbyGymsQuerySchema>
{
  parse(input: object | undefined) {
    return fetchNearbyGymsQuerySchema.parse(input)
  }
}
