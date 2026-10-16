import * as z from "zod";

export const userLabSchema = z.object({
  userId: z.number().int().positive(),
  labId: z.number().int().positive(),
  role: z.string().min(1, "Role is required"),
});

export const userLabInputSchema = userLabSchema.omit({
  userId: true,
  labId: true,
})

export type UserLab = z.infer<typeof userLabSchema>;
export type UserLabInput = z.infer<typeof userLabInputSchema>;, 
