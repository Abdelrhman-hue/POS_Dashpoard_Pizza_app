"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, User, ShieldCheck, Loader2 } from "lucide-react";
import { toggleUserRoleAction } from "@/actions/admin-actions";

type UserItem = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "USER";
  createdAt: string | Date;
};

export default function UsersManager({
  initialUsers,
  currentUserId,
}: {
  initialUsers: UserItem[];
  currentUserId: string;
}) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    return (
      !query ||
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
    );
  });

  const handleToggleRole = async (userId: string, currentRole: string) => {
    if (userId === currentUserId) {
      alert("You cannot change your own admin role!");
      return;
    }

    const actionText = currentRole === "ADMIN" ? "demote to USER" : "promote to ADMIN";
    if (!confirm(`Are you sure you want to ${actionText}?`)) return;

    setLoadingId(userId);
    try {
      const res = await toggleUserRoleAction(userId);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId
              ? { ...u, role: u.role === "ADMIN" ? "USER" : "ADMIN" }
              : u
          )
        );
      } else {
        alert(res.message || "Failed to update user role");
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Users & Staff Management
          </h2>
          <p className="text-xs text-slate-500">
            {users.length} registered accounts in the system
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-11 pr-4 text-xs font-medium text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold text-slate-500">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Email</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Joined Date</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isCurrent = user.id === currentUserId;
                const formattedDate = new Intl.DateTimeFormat("en-US", {
                  dateStyle: "medium",
                }).format(new Date(user.createdAt));

                const initials = user.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-xs font-bold text-orange-600">
                          {user.image ? (
                            <Image
                              src={user.image}
                              alt={user.name}
                              width={40}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {user.name}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] font-bold text-orange-600">
                              (You)
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-600">
                      {user.email}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.role === "ADMIN" ? (
                          <>
                            <ShieldCheck size={13} />
                            ADMIN
                          </>
                        ) : (
                          <>
                            <User size={13} />
                            USER
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      {formattedDate}
                    </td>

                    <td className="py-4 px-6 text-right">
                      {!isCurrent && (
                        <button
                          type="button"
                          disabled={loadingId === user.id}
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                            user.role === "ADMIN"
                              ? "border border-slate-200 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                              : "bg-orange-50 text-orange-600 border border-orange-200 hover:bg-orange-100"
                          }`}
                        >
                          {loadingId === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : user.role === "ADMIN" ? (
                            "Demote to User"
                          ) : (
                            "Promote to Admin"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
