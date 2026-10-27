import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Utensils, Heart, Award, Clock, ArrowRight } from "lucide-react";
import pizza from "@/public/pizza.png";

export const metadata = {
  title: "About Us | Pizza Dashboard",
  description: "Learn more about our heritage, authentic pizza making, and passion.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Utensils,
      title: "Authentic Recipes",
      desc: "Traditional wood-fired crusts crafted with 48-hour slow fermented dough.",
    },
    {
      icon: Heart,
      title: "Handpicked Ingredients",
      desc: "Fresh whole-milk mozzarella, San Marzano tomatoes, and virgin olive oil.",
    },
    {
      icon: Award,
      title: "Quality First",
      desc: "Every pizza is inspected for perfection before leaving our oven to your door.",
    },
    {
      icon: Clock,
      title: "Fast Delivery",
      desc: "Hot and fresh to your doorstep in under 30 minutes, guaranteed.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-5xl space-y-16">
        {/* Hero Banner */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="rounded-full bg-orange-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
              Our Story & Passion
            </span>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl leading-tight">
              Baking happiness, one slice at a time.
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Founded with a burning passion for authentic Italian flavors and modern culinary creativity, our restaurant was born to bring people together over honest, delicious food.
            </p>
            <p className="text-base text-slate-600 leading-relaxed">
              From our signature crispy crusts to bubbling artisan cheeses and secret tomato sauces, every bite is a celebration of flavor, warmth, and hospitality.
            </p>

            <div className="pt-2">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 rounded-2xl bg-orange-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 hover:scale-105 active:scale-95"
              >
                <span>Check Our Menu</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative h-80 w-80 sm:h-96 sm:w-96 rounded-full bg-orange-100/60 p-6">
              <Image
                src={pizza}
                alt="Fresh Pizza"
                fill
                sizes="(max-width: 768px) 100vw, 384px"
                className="object-contain animate-float drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900">
              Why Pizza Lovers Choose Us
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              We take pizza making seriously — because you deserve the very best.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-orange-300 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
