import * as z from "zod";

export const userSchema = z.object({
  userId: z.number().int().positive(),
  userName: z.string().min(1, "User name is required"),
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  lastLoginAt: z.string().optional(),
});
const re = /^(?=[a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
export const userInputSchema = userSchema
  .omit({
    userId: true,
    createdAt: true,
  })
  .extend({
    password: z.preprocess(
      (v) => {
        if (typeof v !== "string") return v;
        if (v === "") return undefined;
        return v.trim();
      },
      z.string().regex(re).min(
        8,
        "Password must have at least 8 characters \
        and include at least one number, one uppercase letter, one lowercase letter, and one of special \
        characters ~!@#$%^&*",
      ),
    ),
  });

export type User = z.infer<typeof userSchema>;
export type UserInput = z.infer<typeof userInputSchema>;
