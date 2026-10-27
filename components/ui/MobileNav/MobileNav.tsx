"use client";

import { Menu, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Routes } from "@/contents/enmes";
import Link from "@/components/ui/link/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";

export default function MobileMenu() {
  const { data: session } = useSession();
  const { totalCount } = useCart();
  const isAdmin = session?.user?.role === "ADMIN";

  const links = [
    { id: "home", name: "Home", href: Routes.ROOT },
    { id: "menu", name: "Menu", href: Routes.MENU },
    { id: "cart", name: `Cart (${totalCount})`, href: "/cart" },
    { id: "about", name: "About", href: Routes.ABOUT },
    { id: "contact", name: "Contact", href: Routes.CONTACT },
    { id: "profile", name: "Profile", href: Routes.PROFILE },
  ];

  const mobileLinkClass =
    "group flex items-center justify-between rounded-xl border border-transparent px-4 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50 hover:text-black hover:shadow-md";

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        }
      />
      <SheetContent side="right" className="p-6">
        <div className="flex flex-col gap-2 pt-6">
          {links.map((link) => (
            <Link key={link.id} href={link.href} className={mobileLinkClass}>
              <span>{link.name}</span>
              {link.id === "cart" && totalCount > 0 && (
                <span className="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-bold text-white">
                  {totalCount}
                </span>
              )}
            </Link>
          ))}

          {isAdmin && (
            <Link
              href="/admin"
              className="mt-2 flex items-center gap-2 rounded-xl bg-orange-50 px-4 py-3 text-base font-bold text-orange-600 border border-orange-200"
            >
              <ShieldAlert size={18} />
              <span>Admin Panel</span>
            </Link>
          )}

          {!session && (
            <div className="mt-4 flex flex-col gap-2 pt-4 border-t">
              <Link
                href="/Auth/login"
                className="flex justify-center rounded-xl border border-orange-500 py-2.5 font-semibold text-orange-600 text-center"
              >
                Sign In
              </Link>
              <Link
                href="/Auth/register"
                className="flex justify-center rounded-xl bg-orange-600 py-2.5 font-semibold text-white text-center"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
