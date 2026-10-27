import { prisma } from "./utils/prisma";
import Credentials from "next-auth/providers/credentials";
import { loginSchema } from "./utils/AuthSchema";
import bcrypt from "bcrypt";
import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@prisma/client";
import google from "next-auth/providers/google";
import apple from "next-auth/providers/apple";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECERT,
    }),
    Credentials({
      async authorize(data) {
        const valid = loginSchema.safeParse(data);
        if (!valid.success) {
          return null;
        }
        const { email, password } = valid.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
          include: { orders: true },
        });

        if (!user || !user.password) {
          return null;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
          return null;
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tokenVersion: user.tokenVersion,
        };
      },
    }),

    apple,
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
        token.tokenVersion = user.tokenVersion;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.tokenVersion = token.tokenVersion as number;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
