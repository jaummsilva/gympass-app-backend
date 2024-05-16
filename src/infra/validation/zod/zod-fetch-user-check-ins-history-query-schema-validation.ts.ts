import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const fetchUserCheckInsHistoryQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
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
