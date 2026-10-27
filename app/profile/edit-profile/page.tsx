"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User,
  Phone,
  MapPin,
  Camera,
  Save,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import Alert from "@/components/ui/Alert";
import Input from "@/components/ui/input";
import { editProfileSchema } from "@/utils/AuthSchema";
import { updateProfileAction } from "@/actions/auth-actions";
import { useSession } from "next-auth/react";

export default function EditProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: session?.user?.name || "",
    phone: "",
    streetAddress: "",
    postalCode: "",
    city: "",
    country: "",
    image: session?.user?.image || "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "error" as "error" | "success",
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = editProfileSchema.safeParse(form);

    if (!result.success) {
      setAlert({
        open: true,
        message: result.error.issues[0]?.message || "Validation failed",
        type: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const updateRes = await updateProfileAction(result.data);

      if (!updateRes.success) {
        setAlert({
          open: true,
          message: updateRes.message || "Failed to update profile",
          type: "error",
        });
        return;
      }

      setAlert({
        open: true,
        message: updateRes.message || "Profile updated successfully!",
        type: "success",
      });

      setTimeout(() => {
        window.location.href = "/profile";
      }, 700);
    } catch (err: unknown) {
      setAlert({
        open: true,
        message: (err as Error).message || "An unexpected error occurred",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-5xl rounded-3xl bg-white p-8 shadow-2xl"
      >
        {/* Alert notification */}
        {alert.open && (
          <div className="mb-6">
            <Alert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert((p) => ({ ...p, open: false }))}
            />
          </div>
        )}

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Edit Profile</h1>
            <p className="mt-2 text-gray-500">
              Update your personal details and default delivery address.
            </p>
          </div>

          <Link
            href="/profile"
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 transition hover:bg-gray-50 text-sm font-semibold text-slate-700"
          >
            <ArrowLeft size={18} />
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
          {/* Avatar Section */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="flex h-40 w-40 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-5xl font-bold text-white shadow-xl ring-4 ring-orange-100">
                {preview || form.image ? (
                  <Image
                    src={preview || form.image}
                    alt="avatar"
                    width={160}
                    height={160}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  (form.name || "U")
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")
                    .toUpperCase()
                )}
              </div>

              <label className="absolute bottom-2 right-2 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border-4 border-white bg-orange-600 text-white transition hover:scale-110 shadow-md">
                <Camera size={20} />
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />
              </label>
            </div>

            <p className="mt-4 text-center text-xs text-gray-500">
              Click the camera icon to upload a photo
            </p>
          </div>

          {/* Form Inputs */}
          <div className="space-y-5 lg:col-span-2">
            <Input
              icon={<User size={18} />}
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                icon={<Phone size={18} />}
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />

              <Input
                icon={<MapPin size={18} />}
                label="Postal Code"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
              />
            </div>

            <Input
              icon={<MapPin size={18} />}
              label="Street Address"
              name="streetAddress"
              value={form.streetAddress}
              onChange={handleChange}
            />

            <div className="grid gap-5 md:grid-cols-2">
              <Input
                icon={<MapPin size={18} />}
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
              />

              <Input
                icon={<MapPin size={18} />}
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/profile"
                className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-center font-bold text-slate-700 transition hover:bg-gray-50 text-sm"
              >
                Cancel
              </Link>

              <button
                disabled={loading}
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-orange-600 py-3.5 font-bold text-white shadow-lg shadow-orange-600/30 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-70 text-sm cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </main>
  );
}
