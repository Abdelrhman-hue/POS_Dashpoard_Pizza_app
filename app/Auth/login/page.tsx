"use client";

import Link from "next/link";
import { Mail, Lock, Pizza, ArrowRight } from "lucide-react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useState, useEffect } from "react";
import { loginSchema } from "@/utils/AuthSchema";
import Alert from "@/components/ui/Alert";
import { AnimatePresence } from "framer-motion";
import { loginAction } from "@/actions/auth-actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error" as "error" | "success",
  });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = loginSchema.safeParse({ email, password });

    if (!valid.success) {
      setAlert({
        open: true,
        message: valid.error.issues[0].message,
        type: "error",
      });

      return;
    }

    setLoading(true);

    try {
      const res = await loginAction({ email, password });

      if (!res.success) {
        setServerError(res.message);
        setEmail("");
        setPassword("");
        return;
      }

      setAlert({
        open: true,
        message: res.message,
        type: "success",
      });

      setTimeout(() => {
        window.location.href = "/profile";
      }, 600);
    } finally {
      setLoading(false);
    }
  };

  // for disapper alert after 5 seconds
  useEffect(() => {
    if (!alert.open) return;

    const timer = setTimeout(() => {
      setAlert((prev) => ({
        ...prev,
        open: false,
      }));
    }, 5000);

    return () => clearTimeout(timer);
  }, [alert.open]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 px-6">
      {/* Background Blur */}
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-orange-300/30 blur-[120px]" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-orange-500/20 blur-[120px]" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Left Side */}
          <div className="hidden flex-col justify-center bg-gradient-to-br from-orange-500 to-orange-600 p-14 text-white md:flex">
            <div className="animate-bounce">
              <Pizza size={60} />
            </div>

            <h1 className="mt-8 text-5xl font-bold leading-tight">
              Welcome Back 👋
            </h1>

            <p className="mt-6 text-lg text-orange-100 leading-8">
              Login to continue ordering your favorite meals and manage your
              account.
            </p>

            <div className="mt-10 h-1 w-28 rounded-full bg-white/50" />
          </div>

          {/* Right Side */}
          <div className="animate-[fadeIn_.6s_ease] p-10 md:p-14">
            <h2 className="text-4xl font-bold text-gray-900">Login</h2>

            <p className="mt-2 text-gray-500">Enter your email and password.</p>

            <form className="mt-10 space-y-6" onSubmit={handleLogin}>
              <AnimatePresence mode="wait">
                {alert.open && (
                  <Alert
                    {...alert}
                    onClose={() =>
                      setAlert((prev) => ({ ...prev, open: false }))
                    }
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
              </AnimatePresence>
              <div>
                <label className="mb-2 block text-sm font-medium">Email</label>

                <div className="flex items-center rounded-xl border bg-gray-50 px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                  <Mail className="mr-3 text-gray-400" size={20} />

                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="h-14 w-full bg-transparent outline-none"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <div className="flex items-center rounded-xl border bg-gray-50 px-4 transition focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-200">
                  <Lock className="mr-3 text-gray-400" size={20} />

                  <input
                    type="password"
                    placeholder="********"
                    className="h-14 w-full bg-transparent outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-orange-600 font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-orange-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Logging in...
                  </>
                ) : (
                  <>
                    Login
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />

              <span className="text-sm text-gray-400">OR</span>

              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <button className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border bg-white transition-all duration-300 hover:border-orange-500 hover:bg-orange-50 mb-2">
              <FaGoogle size={20} />
              Continue with Google
            </button>
            <button className="flex h-14 w-full items-center justify-center gap-3 rounded-xl border bg-white transition-all duration-300 hover:border-orange-500 hover:bg-orange-50">
              <FaApple size={20} />
              Continue with Apple
            </button>

            <p className="mt-8 text-center text-gray-500">
              Don&apos;t have an account?
              <Link
                href="register"
                className="ml-2 font-semibold text-orange-600 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
