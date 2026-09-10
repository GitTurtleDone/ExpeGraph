import * as z from "zod";
export const sampleSchema = z.object({
  sampleId: z.number().int().positive(),
  sampleName: z.string().min(1, "Sample name is required"),
  description: z.string().optional(),
  treatment: z.string().optional(),
  properties: z.preprocess(
   (v) => {
      if (typeof v !== "string") return v;
      const trimmed = v.trim();
      if ( trimmed === "") return undefined;
      try {
        return JSON.parse(trimmed);   
      } catch {
        return v;
      }
    },
    z.record(z.string(), z.unknown(), {
      error: 'Properties must be a JSON object, e.g. {"thickness": 140}',
    }).optional(), 
  ),
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
