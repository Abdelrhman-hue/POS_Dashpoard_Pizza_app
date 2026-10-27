"use client";

import React from "react";
import Link from "../link/link";
import { Routes } from "@/contents/enmes";
import Image from "next/image";
import Logo from "@/public/—Pngtree—pizza logo design vector png_8371650.png";
import { BsCart4 } from "react-icons/bs";
import { ShieldAlert } from "lucide-react";
import MobileMenu from "../MobileNav/MobileNav";
import { useSession } from "next-auth/react";
import UserProfileCard from "@/components/ui/nav/UserProfileCard";
import { useCart } from "@/context/CartContext";

function Nav() {
  const { data: session, status } = useSession();
  const { totalCount, isLoaded } = useCart();

  const isLoggedIn = status === "authenticated";
  const isAdmin = session?.user?.role === "ADMIN";

  const links = [
    { id: "home", name: "Home", href: Routes.ROOT },
    { id: "menu", name: "Menu", href: Routes.MENU },
    { id: "about", name: "About", href: Routes.ABOUT },
    { id: "contact", name: "Contact", href: Routes.CONTACT },
  ];

  const className =
    "group inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:text-black hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5";

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4">
        {/* Logo */}
        <Link href={Routes.ROOT} className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="Logo"
            width={85}
            height={85}
            className="h-12 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link key={link.id} href={link.href} className={className}>
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-orange-50 px-3.5 py-2 text-sm font-bold text-orange-600 border border-orange-200 transition hover:bg-orange-100 hover:border-orange-300 shadow-sm"
            >
              <ShieldAlert size={16} />
              <span>Admin Panel</span>
            </Link>
          )}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Cart Link */}
          <Link
            href="/cart"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 transition hover:border-orange-500 hover:bg-orange-50"
            aria-label="Shopping Cart"
          >
            <BsCart4 size={22} className="text-slate-700" />
            {isLoaded && totalCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-600 px-1 text-xs font-bold text-white shadow-md animate-in zoom-in-50">
                {totalCount > 99 ? "99+" : totalCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {!isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href="/Auth/login"
                className="rounded-xl border border-orange-500 px-5 py-2 font-semibold text-orange-600 transition hover:bg-orange-50"
              >
                Login
              </Link>
              <Link
                href="/Auth/register"
                className="rounded-xl bg-orange-600 px-5 py-2 font-semibold text-white shadow-md shadow-orange-600/20 transition hover:bg-orange-700"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <UserProfileCard
              name={session?.user?.name}
              email={session?.user?.email}
              image={session?.user?.image}
              role={session?.user?.role}
            />
          )}
        </div>

        {/* Mobile Nav */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200"
            aria-label="Shopping Cart"
          >
            <BsCart4 size={20} className="text-slate-700" />
            {isLoaded && totalCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-0.5 text-[10px] font-bold text-white">
                {totalCount}
              </span>
            )}
          </Link>
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
