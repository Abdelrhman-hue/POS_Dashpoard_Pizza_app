"use client";

import { motion } from "framer-motion";
import { Pizza } from "lucide-react";

export default function RegisterHero() {
  return (
    <motion.section
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: -130, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="hidden bg-gradient-to-br from-orange-500 to-orange-600 p-10 text-white lg:flex flex-col justify-center pl-20"
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: 5,
        }}
      >
        <Pizza size={70} />
      </motion.div>

      <h1 className="mt-10 text-6xl font-black leading-tight">Join PizzaHub</h1>

      <p className="mt-8 text-lg leading-9 text-orange-100">
        Create your account and enjoy delicious meals with the fastest delivery.
      </p>
    </motion.section>
  );
}
