import * as z from "zod";

export const userProjectSchema = z.object({
  userId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  role: z.string().optional,
});

export type UserProject = z.infer<typeof userProjectSchema>;
