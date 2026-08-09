"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema } from "@/utils/AuthSchema";
import { registerSchema } from "@/utils/AuthSchema";
import { z } from "zod";
import bcrypt from "bcrypt";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

type logindata = z.infer<typeof loginSchema>;
type registerdata = z.infer<typeof registerSchema>;

export async function loginAction(data: logindata) {
  const valid = loginSchema.safeParse(data);

  if (!valid.success) {
    return {
      success: false as const,
      message: "Invalid credentials",
    };
  }

  const { email, password } = valid.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return {
      success: true as const,
      message: "Login successful",
    };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false as const,
            message: "Invalid email or password",
          };

        default:
          return {
            success: false as const,
            message: "Something went wrong",
          };
      }
    }

    throw error;
  }
}
export async function registerAction(data: registerdata) {
  const valid = registerSchema.safeParse(data);
  if (!valid.success) {
    return { success: false as const, error: valid.error.issues[0].message };
  }
  try {
    if (await prisma.user.findUnique({ where: { email: data.email } })) {
      return { success: false as const, error: "User already exists" };
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        phone: data.phone,
        streetAddress: data.streetAddress,
        postalCode: data.postalCode,
        city: data.city,
        country: data.country,
      },
    });
    return {
      success: true as const,
      message: "Registration successful",
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw new Error("Failed to register user");
  }
}

export const logout = async () => {
   await signOut({
    redirect: false,
  });
};
