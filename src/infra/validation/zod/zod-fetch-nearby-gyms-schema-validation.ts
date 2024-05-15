import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const fetchNearbyGymsQuerySchema = z.object({
  userLatitude: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined)),
  userLongitude: z
    .string()
    .transform((val) => (val ? parseFloat(val) : undefined)),
})

export type FetchNearbyGymsQuerySchema = z.infer<
  typeof fetchNearbyGymsQuerySchema
>

export class ZodFetchNearbyGymsQuerySchemaValidation
  implements Validation<FetchNearbyGymsQuerySchema>
{
  parse(input: object | undefined) {
    return fetchNearbyGymsQuerySchema.parse(input)
  }
}
