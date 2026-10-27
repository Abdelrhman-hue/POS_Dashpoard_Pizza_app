"use client";

import { Suspense, useState } from "react";
import { Lock, ArrowRight, Pizza, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "@/utils/AuthSchema";
import { resetPasswordAction } from "@/actions/auth-actions";
import Alert from "@/components/ui/Alert";
import { AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error" as "error" | "success",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const valid = resetPasswordSchema.safeParse({
      password,
      confirmPassword,
    });

    if (!valid.success) {
      return setAlert({
        open: true,
        message: valid.error.issues[0].message,
        type: "error",
      });
    }

    setLoading(true);

    try {
      const res = await resetPasswordAction(
        {
          password,
          confirmPassword,
        },
        token
      );

      setAlert({
        open: true,
        message: res.message,
        type: res.success ? "success" : "error",
      });

      if (res.success) {
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          window.location.href = "/Auth/login";
        }, 1500);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6">
      <AnimatePresence mode="wait">
        {alert.open && (
          <Alert
            {...alert}
            onClose={() =>
              setAlert((prev) => ({
                ...prev,
                open: false,
              }))
            }
          />
        )}
      </AnimatePresence>

      <div>
        <label className="mb-2 block text-sm font-medium">New Password</label>
        <div className="flex items-center rounded-xl border bg-gray-50 px-4">
          <Lock className="mr-3 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 w-full bg-transparent outline-none"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Confirm Password
        </label>
        <div className="flex items-center rounded-xl border bg-gray-50 px-4">
          <Lock className="mr-3 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="h-14 w-full bg-transparent outline-none"
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-orange-600 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
      >
        {loading ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Updating...
          </>
        ) : (
          <>
            Reset Password
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-100 px-6">
      <div className="absolute left-10 top-10 h-72 w-72 rounded-full bg-orange-300/30 blur-[120px]" />
      <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-orange-500/20 blur-[120px]" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="grid md:grid-cols-2">
          {/* Left */}
          <div className="hidden flex-col justify-center bg-gradient-to-br from-orange-500 to-orange-600 p-14 text-white md:flex">
            <div className="animate-bounce">
              <Pizza size={60} />
            </div>

            <h1 className="mt-8 text-5xl font-bold">Reset Password 🔒</h1>

            <p className="mt-6 text-lg leading-8 text-orange-100">
              Create a new secure password for your account.
            </p>

            <div className="mt-10 h-1 w-28 rounded-full bg-white/50" />
          </div>

          {/* Right */}
          <div className="p-10 md:p-14">
            <h2 className="text-4xl font-bold text-gray-900">Reset Password</h2>
            <p className="mt-2 text-gray-500">Enter your new password below.</p>

            <Suspense
              fallback={
                <div className="flex h-48 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                </div>
              }
            >
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
