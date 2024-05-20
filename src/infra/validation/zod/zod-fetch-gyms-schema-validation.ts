import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

// Defina o esquema de validação
const fetchGymsQuerySchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
})

// Defina o tipo inferido do esquema de validação
export type FetchGymsQuerySchema = z.infer<typeof fetchGymsQuerySchema>

// Implemente a validação
export class ZodFetchGymsQuerySchemaValidation
  implements Validation<FetchGymsQuerySchema>
{
  parse(input: object | undefined) {
    return fetchGymsQuerySchema.parse(input)
  }
}
