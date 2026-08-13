"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { FaAddressBook } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { useState } from "react";
import { registerSchema } from "@/utils/AuthSchema";
import Alert from "@/components/ui/Alert";
import { registerAction } from "@/actions/auth-actions";
import ProvidersButton from "@/components/ui/ProvidersButton";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error" as "error" | "success",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = registerSchema.safeParse(formData);
    if (!valid.success) {
      return setAlert({
        open: true,
        message: valid.error.issues[0].message,
        type: "error",
      });
    }
    registerAction(formData).then((res) => {
      if (!res.success) {
        return setServerError(res.error);
      }
      setServerError("");
      setAlert({
        open: true,
        message: res.message,
        type: "success",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        streetAddress: "",
        postalCode: "",
        city: "",
        country: "",
        password: "",
        confirmPassword: "",
      });
    });
  };
  return (
    <motion.section
      initial={{ x: 80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="p-4 md:p-12"
    >
      <h2 className="text-4xl font-bold">Create Account</h2>

      <p className="mt-2 text-gray-500">
        Start ordering your favorite food today.
      </p>
      {alert.open && (
        <Alert
          open={alert.open}
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ ...alert, open: false })}
        />
      )}
      {serverError && (
        <Alert
          open={!!serverError}
          message={serverError}
          type="error"
          onClose={() => setServerError("")}
        />
      )}
      <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
        <Input
          name="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={<User size={20} />}
          placeholder="Full Name"
        />

        <Input
          name="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail size={20} />}
          placeholder="Email"
        />
        <Input
          name="phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          icon={<Phone size={20} />}
          placeholder="Phone"
        />
        <Input
          name="streetAddress"
          value={formData.streetAddress}
          onChange={(e) =>
            setFormData({ ...formData, streetAddress: e.target.value })
          }
          icon={<FaLocationDot size={20} />}
          placeholder="Address"
        />
        <Input
          name="postalCode"
          value={formData.postalCode}
          onChange={(e) =>
            setFormData({ ...formData, postalCode: e.target.value })
          }
          icon={<FaAddressBook size={20} />}
          placeholder="Postal Code"
        />
        <Input
          name="city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          icon={<FaLocationDot size={20} />}
          placeholder="City"
        />
        <Input
          name="country"
          value={formData.country}
          onChange={(e) =>
            setFormData({ ...formData, country: e.target.value })
          }
          icon={<FaLocationDot size={20} />}
          placeholder="Country"
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            icon={<Lock size={20} />}
            placeholder="Password"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-5 top-4"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <Input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={(e) =>
            setFormData({
              ...formData,
              confirmPassword: e.target.value,
            })
          }
          icon={<Lock size={20} />}
          placeholder="Confirm Password"
        />

        <motion.button
          whileHover={{
            scale: 1.03,
          }}
          whileTap={{
            scale: 0.95,
          }}
          className="h-14 w-full rounded-xl bg-orange-600 font-semibold text-white transition hover:bg-orange-700"
        >
          Create Account
        </motion.button>
      </form>

      <div className="my-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        OR
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      <ProvidersButton />

      <p className="mt-8 text-center text-gray-500">
        Already have an account?
        <Link href="login" className="ml-2 font-semibold text-orange-600">
          Login
        </Link>
      </p>
    </motion.section>
  );
}

function Input({
  icon,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileFocus={{ scale: 1.02 }}
      className="flex h-14 items-center rounded-xl border bg-gray-50 px-4"
    >
      <span className="mr-3 text-gray-400">{icon}</span>

      <input {...props} className="w-full bg-transparent outline-none" />
    </motion.div>
  );
}
