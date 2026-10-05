import * as z from "zod";
export const deviceSchema = z.object({
    deviceId: z.number().int().positive(),
    deviceName: z.string(),
    deviceType: z.string(),
    sampleId: z.number().int().positive()
})

export const deviceInputSchema = deviceSchema.omit({
    deviceId: true
})

export type Device = z.infer<typeof deviceSchema>;
export type DeviceInput = z.infer<typeof deviceInputSchema>;