import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Routes } from "@/contents/enmes";
import Link from "@/components/ui/link/link";

export default function MobileMenu() {
  const links = [
    { id: crypto.randomUUID(), name: "Home", href: Routes.ROOT },
    { id: crypto.randomUUID(), name: "Menu", href: Routes.MENU },
    { id: crypto.randomUUID(), name: "About", href: Routes.ABOUT },
    { id: crypto.randomUUID(), name: "Contact", href: Routes.CONTACT },
    { id: crypto.randomUUID(), name: "Profile", href: Routes.PROFILE },
  ];
  const mobileLinkClass =
    "group flex items-center gap-3 mr-10 ml-2 rounded-xl border border-transparent px-4 py-3 text-base font-medium text-slate-700 transition-all duration-300 hover:border-slate-200 hover:bg-slate-50 hover:text-black hover:shadow-md";
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu />
          </Button>
        }
      />
      <SheetContent side="right">
        {links.map((link) => (
          <Link key={link.id} href={link.href} className={mobileLinkClass}>
            {link.name}
          </Link>
        ))}
      </SheetContent>
    </Sheet>
  );
}
