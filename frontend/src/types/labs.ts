import * as z from "zod";

export const LabSchema = z.object({
    labId: z.number().int().positive(),
    labName: z.string(),
    description: z.string().optional(),
    labLeaderId: z.preprocess(
        (v) => (v === "" ? undefined : Number(v)),
        z.number().int().positive()   
    ),
})