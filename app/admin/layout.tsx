import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Pizza Dashboard",
  description: "Manage orders, menu products, categories and users.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/Auth/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-slate-100/70 pb-20">
      <AdminNav user={session.user} />
      <main className="container mx-auto px-4 pt-8">{children}</main>
    </div>
  );
}
