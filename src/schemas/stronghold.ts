import { z } from 'zod'

export const strongholdPluginInitDialogFormSchema = z.object({
  salt: z.string().min(8)
})
