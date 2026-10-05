import * as z from "zod";

export const transistorSchema = z.object({
  transistorId: z.number().int().positive(),
  geometryType: z.string(),
  gateWidthUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  gateLengthUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  gateInnerRadiusUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  gateOuterRadiusUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  coverageSectorDegree: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  geometryProperties: z.preprocess(
    (v) => {
      if (typeof v !== "string") return v;
      const trimmed = v.trim();
      if (trimmed === "") return undefined;
      try {
        return JSON.parse(trimmed);
      } catch {
        return v;
      }
    },
    z
      .record(z.string(), z.unknown(), {
        error:
          'Geometry properties must be a JSON object, e.g. {"Overlap": 20}',
      })
      .optional(),
  ),
  mobilityCm2Vs: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  onOffRatio: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  thresholdVoltageV: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  subthresholdSwingMvDec: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  sgGapUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
  dgGapUm: z.preprocess(
    (v) => (v === "" ? undefined : Number(v)),
    z.number().positive(),
  ),
});

export const transistorInputSchema = transistorSchema.omit({
  transistorId: true,
});

export type Transistor = z.infer<typeof transistorSchema>;
export type TransistorInput = z.infer<typeof transistorInputSchema>;
