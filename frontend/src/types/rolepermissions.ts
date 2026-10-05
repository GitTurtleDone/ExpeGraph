import * as z from "zod";

export const rolePermissionSchema = z.object({
  roleId: z.number().int().positive(),
  permissionId: z.number().int().positive(),
});

export type RolePermission = z.infer<typeof rolePermissionSchema>;
