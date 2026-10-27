import React from "react";
import { prisma } from "@/utils/prisma";
import { auth } from "@/auth";
import UsersManager from "@/components/admin/UsersManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Users Management | Pizza Dashboard Admin",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const currentUserId = session?.user?.id || "";

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  return <UsersManager initialUsers={users} currentUserId={currentUserId} />;
}
