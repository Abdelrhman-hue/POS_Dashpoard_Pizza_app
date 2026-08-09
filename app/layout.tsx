import type { Metadata } from "next";
import { Roboto, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Nav from "@/components/ui/nav/nav";
import Providers from "./providers";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "300", "500", "700", "900"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Pizza Dashboard",
  description: "A dashboard for managing pizza orders and inventory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        roboto.className,
        roboto.className,
        "font-sans",
        geist.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Nav />
          {children}
        </Providers>
      </body>
    </html>
  );
}
