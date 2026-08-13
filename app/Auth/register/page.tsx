"use client";

import { motion } from "framer-motion";
import RegisterForm from "@/components/ui/register/RegisterForm";
import RegisterHero from "@/components/ui/register/RegisterHero";

export default function RegisterPage() {
  console.log("api",process.env.RESEND_API_KEY)
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100">

      <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-orange-300/30 blur-[120px]" />

      <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-500/20 blur-[120px] m-8" />

      <div className="container relative grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2 mt-25 mb-8">

        <RegisterHero />

        <RegisterForm />

      </div>

    </main>
  );
}