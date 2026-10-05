import { Description } from "@mui/icons-material";
import * as z from "zod";

export const permissionSchema = z.object({
  permissionId: z.number().int().positive(),
  permissionName: z.string().min(1, "Permission name is required"),
  description: z.string().optional(),
});
export const permissionInputSchema = permissionSchema.omit({
  permissionId: true,
});

export type Permission = z.infer<typeof permissionSchema>;
export type PermissionInput = z.infer<typeof permissionInputSchema>;
