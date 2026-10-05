import * as z from "zod";

export const userRoleSchema = z
  .object({
    userId: z.number().int().positive(),
    roleId: z.number().int().positive(),
    roleStartDate: z.string().optional(),
    roleEndDate: z.string().optional(),
  })
  .refine(
    (ur) => {
      if (!ur.roleStartDate || !ur.roleEndDate) return true;
      return new Date(ur.roleStartDate) < new Date(ur.roleEndDate);
    },
    {
      message: "Start date must be earlier than end date",
      path: ["roleEndDate"],
    },
  );

export type UserRole = z.infer<typeof userRoleSchema>;
