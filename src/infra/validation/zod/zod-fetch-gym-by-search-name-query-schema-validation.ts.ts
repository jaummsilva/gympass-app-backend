import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const fetchGymBySearchNameQuerySchema = z.object({
  name: z.string().min(3),
  page: z.string().transform((val) => (val ? parseInt(val) : undefined)),
})

export type FetchGymBySearchNameQuerySchema = z.infer<
  typeof fetchGymBySearchNameQuerySchema
>

export class ZodFetchGymBySearchNameQuerySchemaValidation
  implements Validation<FetchGymBySearchNameQuerySchema>
{
  parse(input: object | undefined) {
    return fetchGymBySearchNameQuerySchema.parse(input)
  }
}
