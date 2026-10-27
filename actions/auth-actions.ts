"use server";
import { prisma } from "@/utils/prisma";
import { loginSchema } from "@/utils/AuthSchema";
import {
  registerSchema,
  forgetpasswordSchema,
  resetPasswordSchema,
  editProfileSchema,
} from "@/utils/AuthSchema";
import { z } from "zod";
import bcrypt from "bcrypt";
import { signIn, signOut, auth } from "@/auth";
import { AuthError } from "next-auth";
import {
  generateVerificationToken,
  forgetpasswordgenerateToken,
} from "@/utils/VerificationToken";
import { emailSend, forgetPasswordSendEmail } from "@/utils/mail";

type logindata = z.infer<typeof loginSchema>;
type registerdata = z.infer<typeof registerSchema>;
type forgetpassword = z.infer<typeof forgetpasswordSchema>;

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
      const verificationToken = await generateVerificationToken(
        valid.data.email
      );
      await emailSend(verificationToken.identifier, verificationToken.token);
      return {
        success: true,
        message:
          "Your email is not verified yet. A new verification link has been sent to your inbox (check server console in dev).",
      };
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
    return { success: false as const, error: valid.error.issues[0]?.message || "Invalid input" };
  }

  try {
    // 1. Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUser) {
      return {
        success: false as const,
        error: "An account already exists with this email address.",
      };
    }

    // 2. Hash password and create user
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

    // 3. Generate verification token and send email
    const verificationToken = await generateVerificationToken(data.email);
    await emailSend(verificationToken.identifier, verificationToken.token);

    return {
      success: true as const,
      message:
        "Account created! Verification link sent to your email (and logged in the server console).",
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
    return {
      success: false as const,
      error: "Failed to register user. Please try again.",
    };
  }
}

export const logout = async () => {
  await signOut({
    redirect: false,
  });
};

export const forgetpasswordAction = async (data: forgetpassword) => {
  try {
    const valid = forgetpasswordSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false as const,
        message: valid.error.issues[0]?.message || "Invalid email",
      };
    }
    const email = valid.data.email;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return {
        success: false as const,
        message: "No user found with this email address.",
      };
    }
    const forgetpasswordtoken = await forgetpasswordgenerateToken(email);
    await forgetPasswordSendEmail(email, forgetpasswordtoken.token);

    return {
      success: true,
      message:
        "Password reset link has been sent to your email (and logged in the server console).",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      message: "Something went wrong while sending reset email",
    };
  }
};

export const resetPasswordAction = async (
  data: z.infer<typeof resetPasswordSchema>,
  token: string
) => {
  try {
    const valid = resetPasswordSchema.safeParse(data);
    if (!valid.success) {
      return {
        success: false as const,
        message: valid.error.issues[0]?.message || "Invalid password",
      };
    }
    const newpassword = valid.data.password;
    const resattoken = await prisma.forgetpasswordToken.findUnique({
      where: { token },
    });
    if (!resattoken) {
      return {
        success: false as const,
        message: "Reset token not found or already used.",
      };
    }
    const isExpired = new Date(resattoken.expires) < new Date();
    if (isExpired) {
      return {
        success: false as const,
        message: "This password reset token has expired.",
      };
    }
    const user = await prisma.user.findUnique({
      where: { email: resattoken.identifier },
    });
    if (!user) {
      return {
        success: false as const,
        message: "User not found.",
      };
    }
    const hashedPassword = await bcrypt.hash(newpassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        tokenVersion: {
          increment: 1,
        },
      },
    });
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    });
    await prisma.forgetpasswordToken.deleteMany({
      where: {
        identifier: resattoken.identifier,
      },
    });
    return {
      success: true,
      message:
        "Your password has been changed successfully. Please log in again.",
    };
  } catch (error) {
    console.error(error);
    return {
      success: false as const,
      message: "Something went wrong resetting your password",
    };
  }
};

export async function updateProfileAction(
  data: z.infer<typeof editProfileSchema>
) {
  const session = await auth();

  const valid = editProfileSchema.safeParse(data);
  if (!valid.success) {
    return {
      success: false as const,
      message: valid.error.issues[0]?.message || "Invalid profile data",
    };
  }

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Unauthorized",
    };
  }

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: data.name,
      phone: data.phone,
      streetAddress: data.streetAddress,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      image: data.image,
    },
  });

  return {
    success: true,
    message: "Profile updated successfully",
  };
}
