import * as z from "zod";
export const sampleSchema = z.object({
    sampleId: z.number().int().positive(),
    sampleName: z.string().min(1, "Sample name is require"),
    description: z.string().optional(),
    treatment: z.string().optional(),

    batchId: z.preprocess(v => v === "" ? undefined: Number(v), z.number().int().positive().optional()),
    createdAt: z.string().optional(),
    

})