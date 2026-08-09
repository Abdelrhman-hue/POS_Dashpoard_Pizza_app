"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, ChevronRight } from "lucide-react";
import { useState } from "react";

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

  // أول حرفين من الاسم
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

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
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white">
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
            initial={{
              opacity: 0,
              y: -10,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.95,
            }}
            transition={{
              duration: 0.2,
            }}
            className="absolute right-0 top-full z-50 mt-3 w-72"
          >
            <Link href="/profile">
              <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white p-4 shadow-2xl">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-lg font-bold text-white">
                    {image ? (
                      <Image
                        src={image}
                        alt={userName}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  {/* Name + Email */}
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-gray-900">
                      {userName}
                    </h3>

                    <p className="flex items-center gap-1 truncate text-sm text-gray-500">
                      <Mail size={13} />
                      {email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                {role && (
                  <div className="mt-4">
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-orange-600">
                      {role}
                    </span>
                  </div>
                )}

                {/* Divider */}
                <div className="my-4 h-px bg-gray-100" />

                {/* Profile Link */}
                <div className="flex items-center justify-between rounded-xl bg-orange-50 px-4 py-3 text-orange-600 transition hover:bg-orange-100">
                  <div className="flex items-center gap-2">
                    <User size={18} />

                    <span className="font-semibold">View Profile</span>
                  </div>

                  <ChevronRight size={18} />
                </div>
              </div>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
