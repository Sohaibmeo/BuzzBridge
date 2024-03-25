import { ZodType, z } from "zod";
import { ResetPassword } from "../../../types/UserTypes";

export const ChangePasswordSchema: ZodType<ResetPassword> = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .regex(
        /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~`\\\-|=])/,
        "Password must contain at least one number, uppercase letter, and a special character"
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const ChangeUserDataSchema = z.object({
  
});

export const EmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ChangePasswordType = z.infer<typeof ChangePasswordSchema>;
