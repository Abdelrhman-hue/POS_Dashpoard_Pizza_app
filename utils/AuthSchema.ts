import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
});

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" }),
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  phone: z
    .string()
    .min(10, { message: "Phone number must be at least 10 characters long" })
    .max(15, { message: "Phone number must be at most 15 characters long" }),
  streetAddress: z
    .string()
    .min(2, { message: "Street address must be at least 10 characters long" })
    .max(100, {
      message: "Street address must be at most 100 characters long",
    }),
  postalCode: z
    .string()
    .min(2, { message: "Postal code must be at least 5 characters long" })
    .max(10, { message: "Postal code must be at most 10 characters long" }),
  city: z
    .string()
    .min(2, { message: "City must be at least 2 characters long" })
    .max(100, { message: "City must be at most 100 characters long" }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters long" })
    .max(100, { message: "Country must be at most 100 characters long" }),
});

export const forgetpasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const editProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long"),

  phone: z
    .string()
    .trim()
    .max(20, "Phone number is too long"),

  streetAddress: z
    .string()
    .trim()
    .max(150, "Address is too long"),

  postalCode: z
    .string()
    .trim()
    .max(20, "Postal code is too long"),

  city: z
    .string()
    .trim()
    .max(50, "City is too long"),

  country: z
    .string()
    .trim()
    .max(50, "Country is too long"),

  image: z
    .string()
    .url("Invalid image URL")
    .or(z.literal("")),
});
