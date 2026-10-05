import * as z from "zod";

export const tlmSchema = z.object({
  tlmId: z.number().int().positive(),
  geometryType: z.string().min(1, "Geormetry Type is required"),
  sheetResistanceOhmSq: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  contactResistanceOhm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  transferLengthCm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
});

export const tlmInputSchema = tlmSchema.omit({
  tlmId: true,
});

export type Tlm = z.infer<typeof tlmSchema>;
export type TlmInput = z.infer<typeof tlmInputSchema>;
