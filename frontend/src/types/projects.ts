import * as z from "zod";

export const projectSchema = z.object({
  projectId: z.number().int().positive(),
  projectName: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  funding: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const projectInputSchema = projectSchema.omit({
  projectId: true,
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectInput = z.infer<typeof projectInputSchema>;
