import React from "react";
import Image from "next/image";
import Link from "@/components/ui/link/link";
import { Button } from "@/components/ui/button";
import pizza from "@/public/pizza.png";
import { FaRegArrowAltCircleRight } from "react-icons/fa";

function Hero() {
  return (
    <section className="flex min-h-[calc(100vh-80px)] items-center animate-fade-up">
      <div className="container mx-auto px-4 grid items-center gap-16 py-12 md:grid-cols-2">
        {/* Left */}
        <div className="space-y-8">
          <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600">
            🍕 Fresh & Hot Pizza
          </span>

          <h1 className="text-5xl font-extrabold leading-tight lg:text-7xl">
            Slice into <span className="text-primary">Happiness</span>
          </h1>

          <p className="max-w-lg text-lg leading-8 text-muted-foreground">
            Craving pizza? We&apos;ve got you covered with fresh ingredients, endless
            flavors, and the fastest delivery. Your perfect slice is just a tap
            away!
          </p>

          <Link href="/menu">
            <Button
              size="lg"
              className="group rounded-xl px-8 py-7 text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              Order Now
              <FaRegArrowAltCircleRight className="ml-2 transition-transform duration-300 group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>

        {/* Right */}
        <div className="relative hidden justify-center md:flex ">
          <Image
            src={pizza}
            alt="Pizza"
            priority
            className="animate-float w-full max-w-lg drop-shadow-[0_25px_45px_rgba(0,0,0,.25)]"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
