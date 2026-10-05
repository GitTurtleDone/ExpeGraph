import * as z from "zod";

export const labSchema = z.object({
    labId: z.number().int().positive(),
    labName: z.string(),
    description: z.string().optional(),
    labLeaderId: z.preprocess(
        (v) => (v === "" ? undefined : Number(v)),
        z.number().int().positive()   
    ),
});
export const labInputSchema = labSchema.omit({
    labId: true,
});

export type Lab = z.infer<typeof labSchema>;
export type LabInput = z.infer<typeof labInputSchema>;