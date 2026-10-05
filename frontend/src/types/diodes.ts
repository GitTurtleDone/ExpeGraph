import * as z from "zod";
import { ja } from "zod/v4/locales";

export const diodeSchema = z.object({
    diodeId: z.number().int().positive(),
    geometryType: z.string(),
    anodeWidthUm: z.number().positive().optional(),
    anodeLengthUm: z.number().positive().optional(),
    chamferRadiusUm: z.number().positive().optional(),
    anodeRadiusUm: z.number().positive().optional(),
    geometryProperties: z.preprocess(
        (v) => {
            if (typeof v !== "string") return v; // in case v is already an object
            const trimmed = v.trim();
            if (trimmed === "") return undefined; // in case there is an empty string in properties
            try {
                return JSON.parse(trimmed);
            } catch {
                return v
            }
        }, z.record(
                    z.string(), z.unknown(), 
                    {"error": 'Properties must be a JSON object, e.g. {"Max current density, A/cm2": 100}'})
            .optional()),
    barrierHeightEv: z.number().positive().optional(),
    idealityFactor: z.number().positive().optional(),
    recRatio: z.number().positive().optional(),
    builtInPotentialV: z.number().positive().optional(),
    carrierConcentration: z.number().positive().optional(),
    maxCurrentA: z.number().positive().optional(),
    voltageAtMaxCurrentV: z.number().positive().optional(),
    breakdownVoltageV: z.number().positive().optional()
});

export const diodeInputSchema = diodeSchema.omit({
    diodeId: true
});

export type Diode = z.infer<typeof diodeSchema>;
export type DiodeInput = z.infer<typeof diodeInputSchema>;