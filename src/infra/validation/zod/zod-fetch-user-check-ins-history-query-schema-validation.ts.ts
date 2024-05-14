import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const fetchUserCheckInsHistoryQuerySchema = z.object({
  page: z.string().transform((val) => (val ? parseInt(val) : undefined)),
})

export type FetchUserCheckInsHistoryQuerySchema = z.infer<
  typeof fetchUserCheckInsHistoryQuerySchema
>

export class ZodFetchUserCheckInsHistoryQuerySchemaValidation
  implements Validation<FetchUserCheckInsHistoryQuerySchema>
{
  parse(input: object | undefined) {
    return fetchUserCheckInsHistoryQuerySchema.parse(input)
  }
}
