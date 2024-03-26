import { ZodType, z } from "zod";
import { ResetPassword, UpdateUser } from "../../../types/UserTypes";

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
    password: z.string().optional(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const EmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export const ChangeEmailSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    confirmEmail: z.string().email("Invalid email address"),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails do not match",
    path: ["confirmEmail"],
  });

export const UpdateUserProfileSchema: ZodType<UpdateUser> = z.object({
  name: z.string().min(2, "Name must be at least 3 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  age: z.coerce
    .number()
    .int()
    .positive("Age must be a positive number")
    .optional(),
  gender: z.string().optional(),
  about: z
    .string()
    .max(500, "About must be less than 500 characters")
    .optional(),
});
