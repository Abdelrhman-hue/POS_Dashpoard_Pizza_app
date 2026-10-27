import NextAuth from "next-auth";
import type { UserRole } from "@prisma/client";
import authConfig from "./auth.config";
import { prisma } from "./utils/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") {
        return true;
      }
      const userdb = await prisma.user.findUnique({ where: { id: user.id } });
      if (!userdb?.emailVerified) {
        return false;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tokenVersion = user.tokenVersion;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          id: token.id as string,
        },
        select: {
          tokenVersion: true,
          role: true,
        },
      });

      if (!dbUser) {
        token.invalid = true;
        return token;
      }

      token.role = dbUser.role as UserRole;

      if (dbUser.tokenVersion !== token.tokenVersion) {
        token.invalid = true;
      }

      return token;
    },

    async session({ session, token }) {
      const dbUser = await prisma.user.findUnique({
        where: {
          id: token.id as string,
        },
      });

      if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
        session.user = undefined as never;
        return session;
      }

      session.user.id = dbUser.id;
      session.user.name = dbUser.name;
      session.user.email = dbUser.email;
      session.user.image = dbUser.image;
      session.user.role = dbUser.role as UserRole;
      session.user.tokenVersion = dbUser.tokenVersion;

      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
});
