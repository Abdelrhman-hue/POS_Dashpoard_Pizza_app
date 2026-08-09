import NextAuth from "next-auth";
import { prisma } from "./utils/prisma";
import Credentials from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { loginSchema } from "./utils/AuthSchema";
import bcrypt from "bcrypt";
import type { UserRole } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
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
          include: {orders: true }
          
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
        };
      },
    }),
  ],
    callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
});
