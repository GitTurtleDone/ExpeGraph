import * as z from "zod";

export const roleSchema = z.object({
  roleId: z.number().int().positive(),
  roleName: z.string().min(1, "Role name is required"),
  description: z.string().optional(),
});

export const roleInputSchema = roleSchema.omit({
  roleId: true,
});

export type Role = z.infer<typeof roleSchema>;
export type RoleInput = z.infer<typeof roleInputSchema>;
