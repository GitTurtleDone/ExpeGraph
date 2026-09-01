import * as z from "zod";
export const sampleSchema = z.object({
  sampleId: z.number().int().positive(),
  sampleName: z.string().min(1, "Sample name is required"),
  description: z.string().optional(),
  treatment: z.string().optional(),
  properties: z.record(z.string(), z.unknown()).optional(),
  batchId: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().int().positive().optional(),
  ),
  createdAt: z.string().optional(),
});

export const sampleInputSchema = sampleSchema.omit({
  sampleId: true,
  createdAt: true,
});

export type Sample = z.infer<typeof sampleSchema>;
export type SampleInput = z.infer<typeof sampleInputSchema>;
