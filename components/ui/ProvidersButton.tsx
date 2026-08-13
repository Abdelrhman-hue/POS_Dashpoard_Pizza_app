
import { FaGoogle, FaApple } from "react-icons/fa";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";

type Provider = "google" | "apple";

function ProvidersButton() {
  const handelprovider = (provider: Provider) => {
    signIn(provider, { redirectTo: "/profile" });
  };
  return (
    <div>
      <motion.button
        onClick={() => {
          handelprovider("google");
        }}
        whileHover={{ scale: 1.02 }}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border duration-300 hover:border-orange-500 hover:bg-orange-50 mb-2"
      >
        <FaGoogle size={20} />
        Continue with Google
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border duration-300 hover:border-orange-500 hover:bg-orange-50"
      >
        <FaApple size={20} />
        Continue with Apple
      </motion.button>
    </div>
  );
}

export default ProvidersButton;
