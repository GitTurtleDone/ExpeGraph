import * as z from "zod";

export const userProjectSchema = z.object({
  userId: z.number().int().positive(),
  projectId: z.number().int().positive(),
  role: z.string().optional,
});

export const userProjectInputSchema = userProjectSchema.omit({
  userId: true,
  projectId: true,
});
export type UserProject = z.infer<typeof userProjectSchema>;
export type UserProjectInput = z.infer<typeof userProjectInputSchema>;