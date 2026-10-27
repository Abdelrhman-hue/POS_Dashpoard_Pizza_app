"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, ChevronRight, ShieldAlert, LogOut } from "lucide-react";
import { useState } from "react";
import { logout } from "@/actions/auth-actions";

type UserProfileCardProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export default function UserProfileCard({
  name,
  email,
  image,
  role,
}: UserProfileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const userName = name || "User";

  // Initials
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const isAdmin = role === "ADMIN";

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* User Button */}
      <Link
        href="/profile"
        className="flex items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-orange-50"
      >
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white shadow-sm">
          {image ? (
            <Image
              src={image}
              alt={userName}
              width={36}
              height={36}
              className="h-full w-full object-cover"
            />
          ) : (
            initials
          )}
        </div>

        {/* Name */}
        <span className="hidden max-w-32 truncate font-medium text-gray-700 sm:block">
          {userName}
        </span>
      </Link>

      {/* Profile Card */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full z-50 mt-2 w-72"
          >
            <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-2xl">
              {/* User Info */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-base font-bold text-white">
                  {image ? (
                    <Image
                      src={image}
                      alt={userName}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-bold text-gray-900">{userName}</h3>
                  <p className="flex items-center gap-1 truncate text-xs text-gray-500">
                    <Mail size={12} />
                    {email}
                  </p>
                </div>
              </div>

              {/* Role */}
              {role && (
                <div className="mt-3">
                  <span className="inline-flex rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold uppercase text-orange-600">
                    {role}
                  </span>
                </div>
              )}

              {/* Divider */}
              <div className="my-3 h-px bg-gray-100" />

              {/* Links */}
              <div className="space-y-1.5">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center justify-between rounded-xl bg-orange-50 px-3.5 py-2.5 text-sm font-bold text-orange-600 transition hover:bg-orange-100"
                  >
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={16} />
                      <span>Admin Panel</span>
                    </div>
                    <ChevronRight size={16} />
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="flex items-center justify-between rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>My Profile</span>
                  </div>
                  <ChevronRight size={16} />
                </Link>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
