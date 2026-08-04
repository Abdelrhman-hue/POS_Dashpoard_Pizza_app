import React from "react";
import Link from "../link/link";
import { Routes } from "@/contents/enmes";
import Image from "next/image";
import Logo from "@/public/—Pngtree—pizza logo design vector png_8371650.png";
import { Button } from "../button";
import { BsCart4 } from "react-icons/bs";
import MobileMenu from "../MobileNav/MobileNav";


function Nav() {
  const links = [
    { id: crypto.randomUUID(), name: "Home", href: Routes.ROOT },
    { id: crypto.randomUUID(), name: "Menu", href: Routes.MENU },
    { id: crypto.randomUUID(), name: "About", href: Routes.ABOUT },
    { id: crypto.randomUUID(), name: "Contact", href: Routes.CONTACT },
    { id: crypto.randomUUID(), name: "Profile", href: Routes.PROFILE },
  ];
  const className = "group inline-flex items-center gap-2 capitalize rounded-xl px-6 py-2 font-medium text-slate-700 shadow-sm transition-all duration-300 hover:bg-slate-50 hover:text-black hover:shadow-lg hover:scale-[1.02] hover:-translate-y-0.5";
  return (
    <header className="container">
      <nav>
        <div className="flex flex-row justify-between items-center py-2">
          <Link href={Routes.ROOT} className="">
            <Image src={Logo} alt="Logo" width={150} height={150} />
          </Link>
          <div className="hidden lg:flex flex-row gap-4">
            {links.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className={className}
              >
                {link.name.toLowerCase() || "Home"}
              </Link>
            ))}
            <Link
              key={crypto.randomUUID()}
              href={Routes.CART}
              className={className}
            >
              <BsCart4 />
            </Link>
            <Button className="group rounded-xl px-4 py-6 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Link key={crypto.randomUUID()} href={Routes.AUTH}>
                Login
              </Link>
            </Button>
            <Button className="group rounded-xl px-4 py-6 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              <Link key={crypto.randomUUID()} href={Routes.REGISTER}>
                Signup
              </Link>
            </Button>
          </div>
          <MobileMenu />
        </div>
      </nav>
    </header>
  );
}

export default Nav;
