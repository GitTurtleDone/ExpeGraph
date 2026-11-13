import * as z from "zod";

export const userSchema = z.object({
  userId: z.number().int().positive(),
  username: z.string().min(1, "Username is required"),
  email: z.email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  isActive: z.boolean(),
  createdAt: z.string(),
  lastLoginAt: z.string().optional(),
});

// to display rows in a grid
export const userRowSchema = userSchema.omit({
  isActive: true,
  createdAt: true,  
})

const re = /^(?=[a-zA-Z])(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
export const userInputSchema = userSchema
  .omit({
    userId: true,
    createdAt: true,
    isActive: true,
    lastLoginAt: true,
  })
  .extend({
    password: z.preprocess(
      (v) => {
        if (typeof v !== "string") return v;
        if (v === "") return undefined;
        return v.trim();
      },
      z
        .string()
        .regex(
          re,
          "Password must start with a letter and include at least one number, one uppercase letter, one lowercase letter, and one of special \
        characters ~!@#$%^&*",
        )
        .min(8, "Password must have at least 8 characters."),
    ),
  });
  
export type User = z.infer<typeof userSchema>;
// for left panels
export type UserDisplayedColumns = z.infer<typeof userRowSchema>;
// checkboxes in advanced search
export type UserAdvancedSearchCheckboxes = {
  idRangeChb: boolean,
  isActiveChb: boolean,
  lastLoginRangeChb: boolean,
}
// search fields included in advanced search
export type UserAdvancedSearchFields = {
  minId: string,
  maxId: string,
  isActive: boolean,
  lastLoginFrom: string,
  lastLoginTo: string,
}

export const userAdvancedSearchFieldSchema = {
  minId: z.string,
  maxId: z.string(),
}
// for right panels
export type UserInput = z.infer<typeof userInputSchema>;
