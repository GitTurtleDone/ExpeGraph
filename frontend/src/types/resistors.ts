import * as z from "zod";

export const resistorSchema = z.object({
  resistorId: z.number().int().positive(),
  geometryType: z.string(),
  widthUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  gapUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  innerRadiusUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  outerRadiuUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  geometryProperties: z.preprocess(
    (v) => {
      if (typeof v !== "string") return v; // already an object
      const trimmed = v.trim();
      if (trimmed === "") return undefined; // empty string return undefine
      try {
        return JSON.parse(trimmed);
      } catch {
        return v;
      }
    },
    z
      .record(z.string(), z.unknown(), {
        error:
          'Geometry properties must be a JSON object, e.g., {"width": 200}',
      })
      .optional(),
  ),
  resistanceOhm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive().optional(),
  ),
  tlmId: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().int().positive().optional(),
  ),
});

export const resistorInputSchema = resistorSchema.omit({
  resistorId: true,
});

export type Resistor = z.infer<typeof resistorSchema>;
export type ResistorInput = z.infer<typeof resistorInputSchema>;
