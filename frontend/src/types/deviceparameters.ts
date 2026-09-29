import * as z from "zod";

export const deviceParameterSchema = z.object({
    deviceParameterId: z.number().int().positive(),
    deviceId: z.number().int().positive(),
    key: z.string().optional(),
    value: z.string().optional(),
});

export const deviceParameterInputSchema = deviceParameterSchema.omit({
    deviceParameterId: true
});

export type DeviceParameter = z.infer<typeof deviceParameterSchema>;
export type DeviceParameterInput = z.infer<typeof deviceParameterInputSchema>;