import {z} from "zod";

export const loginSchema = z.object({
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(6,{message: "Password must be at least 6 characters long"}).max(100,{message: "Password must be at most 100 characters long"}),
});

export const registerSchema = z.object({
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(6,{message: "Password must be at least 6 characters long"}).max(100,{message: "Password must be at most 100 characters long"}),
  name: z.string().min(2,{message: "Name must be at least 2 characters long"}),
  phone: z.string().min(10,{message: "Phone number must be at least 10 characters long"}).max(15,{message: "Phone number must be at most 15 characters long"}),
  streetAddress: z.string().min(2,{message: "Street address must be at least 10 characters long"}).max(100,{message: "Street address must be at most 100 characters long"}),
  postalCode: z.string().min(2,{message: "Postal code must be at least 5 characters long"}).max(10,{message: "Postal code must be at most 10 characters long"}),
  city: z.string().min(2,{message: "City must be at least 2 characters long"}).max(100,{message: "City must be at most 100 characters long"}),
  country: z.string().min(2,{message: "Country must be at least 2 characters long"}).max(100,{message: "Country must be at most 100 characters long"}),
});