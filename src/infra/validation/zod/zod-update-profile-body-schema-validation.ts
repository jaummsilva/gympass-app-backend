import { z } from 'zod'

import type { Validation } from '@/core/validation/validation'

const profileUpdateBodySchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(0)
    .max(255)
    .refine((value) => value === '' || value.length >= 6, {
      message: 'Password must be empty or contain at least 6 characters',
    })
    .optional(),
  name: z.string(),
})

export type ProfileUpdateBodySchema = z.infer<typeof profileUpdateBodySchema>

export class ZodProfileUpdateBodySchemaValidation
  implements Validation<ProfileUpdateBodySchema>
{
  parse(input: object | undefined) {
    return profileUpdateBodySchema.parse(input)
  }
}
