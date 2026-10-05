import * as z from "zod";

export const measurementSchema = z.object({
    measurementId: z.number().int().positive(),
    deviceId: z.preprocess(
        (v) => v === "" ? undefined : Number(v),
        z.number().int().positive().optional()
    ),
    sampleId: z.preprocess(
        (v) => v === "" ? undefined : Number(v),
        z.number().int().positive().optional() 
    ),
    equipmentId: z.preprocess(
        (v) => v === "" ? undefined : Number(v),
        z.number().int().positive().optional()
    ),
    userId: z.preprocess(
        (v) => v === "" ? undefined : Number(v),
        z.number().int().positive().optional()
    ),
    measurementType: z.string().min(1, "Measurement type is required"),
    measuredAt: z.string().min(1, "Measurement time is required"),
    temperatureK: z.preprocess((v) => v === "" ? undefined: Number(v), z.number().optional()),
    humidityPercent: z.preprocess((v) => v === "" ? undefined: Number(v), z.number().optional()),
    notes: z.string().optional(),
    dataFilePath: z.string().min(1, "Path to datafile must exist")
});

export const measurementInputSchema = measurementSchema.omit({
    measurementId: true
});

export type Measurement = z.infer<typeof measurementSchema>;
export type MeasurementInput = z.infer<typeof measurementInputSchema>;