import * as z from "zod";

export const diodeSchema = z.object({
    diodeId: z.number().int().positive(),
    geometryType: z.string(),
    anodeWidthUm: z.number().positive().optional(),
    anodeLengthUm: z.number().positive().optional(),
    chamferRadiusUm: z.number().positive().optional(),
    anodeRadiusUm: z.number().positive().optional(),
    geometryProperties: z.preprocess((v) => {

    }),
    barrierHeightEv: z.number().positive().optional(),
    idealityFactor: z.number().positive().optional(),
    recRatio: z.number().positive().optional(),
    builtInPotentialV: z.number().positive().optional(),
    carrierConcentration: z.number().positive().optional(),
    maxCurrentA: z.number().positive().optional(),
    voltageAtMaxCurrentV: z.number().positive().optional(),
    breakdownVoltageV: z.number().positive().optional()

});