import * as z from "zod";

export const labProjectSchema = z.object({
    labId: z.number().int().positive(),
    projectId: z.number().int().positive()
});

export type LabProject = z.infer<typeof labProjectSchema>;