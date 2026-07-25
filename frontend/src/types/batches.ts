import * as z from "zod";

export const batchSchema = z.object({
    batchId: z.string(),
    batchName: z.string().min(1, "Batch name is required"),
    description: z.string().optional(),
    fabricationDate: z.string().min(1, "Fabrication date is required"),
    treatment: z.string().optional(),
    projectId: z.preprocess(v => v === "" ? undefined : Number(v), z.number().int().positive().optional()),
    labId: z.preprocess(v => v === "" ? undefined : Number(v), z.number().int().positive().optional()),
    createdAt: z.string().optional(),
})

export const batchInputSchema = batchSchema.omit({
    batchId: true,
    createdAt: true
})

export type Batch = z.infer<typeof batchSchema>
export type BatchInput = z.infer<typeof batchInputSchema>    