import * as z from "zod";

export const labEquipmentSchema = z.object({
  labId: z.number().int().positive(),
  equipmentId: z.number().int().positive(),
});

export type LabEquipment = z.infer<typeof labEquipmentSchema>;
