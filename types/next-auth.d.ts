import { DefaultSession } from "next-auth";
import { DefaultJWT } from "@auth/core/jwt";
import { UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      tokenVersion: number;
    };
  }

  interface User {
    id: string;
    role: UserRole;
    tokenVersion: number;
  }
}

declare module "@auth/core/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    tokenVersion: number;
    invalid?: boolean;
  }
}