"use client";

import React from "react";
import Link from "../link/link";
import { Routes } from "@/contents/enmes";
import Image from "next/image";
import Logo from "@/public/—Pngtree—pizza logo design vector png_8371650.png";
import { BsCart4 } from "react-icons/bs";
import MobileMenu from "../MobileNav/MobileNav";
import { useState } from "react";
import { useSession } from "next-auth/react";
import UserProfileCard from "@/components/ui/nav/UserProfileCard";

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session, status } = useSession();

  const isLoggedIn = status === "authenticated";


  const links = [
    { id: "home", name: "Home", href: Routes.ROOT },
    { id: "menu", name: "Menu", href: Routes.MENU },
    { id: "about", name: "About", href: Routes.ABOUT },
    { id: "contact", name: "Contact", href: Routes.CONTACT },
  ];

  const className =
    "group inline-flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:text-black hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5";

  return (
    <nav className="w-full border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href={Routes.ROOT}>
          <Image
            src={Logo}
            alt="Logo"
            width={100}
            height={100}
            className="object-contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link key={link.id} href={link.href} className={className}>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Cart */}
          <button
            className="
              relative
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-xl
              border
              transition
              hover:border-orange-500
              hover:bg-orange-50
            "
          >
            <BsCart4 size={22} />

            <span
              className="
              absolute
              -right-1
              -top-1
              flex
              h-5
              w-5
              items-center
              justify-center
              rounded-full
              bg-orange-600
              text-xs
              font-bold
              text-white
            "
            >
              0
            </span>
          </button>

          {/* Auth */}
          {!isLoggedIn ? (
            <>
              <Link
                href="/Auth/login"
                className="
                  rounded-xl
                  border
                  border-orange-500
                  px-5
                  py-2
                  font-semibold
                  text-orange-600
                  transition
                  hover:bg-orange-50
                "
              >
                Login
              </Link>

              <Link
                href="/Auth/register"
                className="
                  rounded-xl
                  bg-orange-600
                  px-5
                  py-2
                  font-semibold
                  text-white
                  transition
                  hover:bg-orange-700
                "
              >
                Sign Up
              </Link>
            </>
          ) : (
            <UserProfileCard
              name={session?.user?.name}
              email={session?.user?.email}
              image={session?.user?.image}
              role={session?.user?.role}
            />
          )}
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}

export default Nav;
