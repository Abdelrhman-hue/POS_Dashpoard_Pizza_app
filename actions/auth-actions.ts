"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema } from "@/utils/AuthSchema";
import { registerSchema } from "@/utils/AuthSchema";
import { success, z } from "zod";
import bcrypt from "bcrypt";
import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/utils/VerificationToken";
import { emailSend } from "@/utils/mail";

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
    const user = await prisma.user.findUnique({ where: { email: email } });
    if (!user || !user.email || !user.password) {
      return {
        success: false as const,
        message: "Invalid credentials",
      };
    }

    if (!user?.emailVerified) {
      // generate token
      const VerificationToken = await generateVerificationToken(
        valid.data.email,
      );
      //  send email
      console.log("identifier", VerificationToken.identifier);
      await emailSend(VerificationToken.identifier, VerificationToken.token);
      return { success: true, message: "Email saned check your email" };
    }
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
  // generate token
  const VerificationToken = await generateVerificationToken(data.email);
  console.log("identifier", VerificationToken.identifier);
  //  send email
  try {
    console.log("Before emailSend");
    await emailSend(VerificationToken.identifier, VerificationToken.token);
    console.log("After emailSend");
    // return { success: true, message: "Email saned check your email" };
  } catch (err) {
    console.error("Email Error:", err);

    return {
      success: false as const,
      error: "Failed to send verification email",
    };
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
      message: "Verification email sent. Please check your inbox.",
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
