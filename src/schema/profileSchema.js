import * as z from "zod";

export const editProfileSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, { message: "Name is required" }),
  email: z
    .string({ required_error: "Email is required" })
    .min(1, { message: "Email is required" }),
  contact: z
    .string({ required_error: "Contact is required" })
    .min(1, { message: "Contact is required" }),
});

export const changePasswordSchema = z.object({
  oldPassword: z
    .string({ required_error: "Old Password is required" })
    .min(1, { message: "Old Password is required" }),
  newPassword: z
    .string({ required_error: "New Password is required" })
    .min(1, { message: "New Password is required" }),
  confirmPassword: z
    .string({ required_error: "Confirm Password is required" })
    .min(1, { message: "Confirm Password is required" }),
});
