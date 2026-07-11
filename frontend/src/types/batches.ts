import * as z from "zod";

export const batchSchema = z.object({
    batchId: z.string(),
    batchName: z.string(),
    description: z.string().optional(),
    fabricationDate: z.string().optional(),
    treatment: z.string().optional(),
    projectId: z.string().optional(),
    labId: z.string().optional(),
    createdAt: z.string().optional(),
})

export const batchInputSchema = batchSchema.omit({
    batchId: true,
    createdAt: true
})

export type Batch = z.infer<typeof batchSchema>
export type BatchInput = z.infer<typeof batchInputSchema>    