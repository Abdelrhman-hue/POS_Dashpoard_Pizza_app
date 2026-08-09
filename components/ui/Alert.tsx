"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type AlertProps = {
  open: boolean;
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Alert({
  open,
  message,
  type = "error",
  onClose,
}: AlertProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
            y: -50,
            scale: 0.9,
          }}
          animate={{
            opacity: 1,
            y: 20,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            y: -50,
            scale: 0.9,
          }}
          transition={{
            type: "spring",
            stiffness: 250,
            damping: 20,
          }}
          className="fixed left-1/2 top-5 z-50 w-[90%] max-w-md -translate-x-1/2"
        >
          <div
            className={`flex items-center gap-4 rounded-xl border p-4 shadow-xl ${
              type === "success"
                ? "border-green-300 bg-green-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            {type === "success" ? (
              <CheckCircle2 className="shrink-0 text-green-600" size={24} />
            ) : (
              <AlertCircle className="shrink-0 text-red-600" size={24} />
            )}

            <p className="flex-1 font-medium text-gray-700">{message}</p>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 transition hover:bg-black/10"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
