import { z } from 'zod'

export const initStrongholdDialogFormSchema = z.object({
  salt: z.string().min(8)
})
