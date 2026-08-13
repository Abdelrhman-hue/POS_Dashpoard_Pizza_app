import { prisma } from "@/utils/prisma";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

type Props = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return <StatusCard success={false} message="Invalid verification link." />;
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });

  if (!verificationToken) {
    return (
      <StatusCard success={false} message="Verification token is invalid." />
    );
  }

  if (verificationToken.expires < new Date()) {
    await prisma.verificationToken.delete({
      where: {
        token,
      },
    });

    return (
      <StatusCard success={false} message="Verification link has expired." />
    );
  }

  await prisma.user.update({
    where: {
      email: verificationToken.identifier,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: {
      token,
    },
  });

  return (
    <StatusCard success message="Your email has been verified successfully." />
  );
}

function StatusCard({
  success,
  message,
}: {
  success: boolean;
  message: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-2xl transition-all duration-300 hover:-translate-y-2">
        <div className="mb-6 flex justify-center transition-all duration-300 hover:-translate-y-2 ">
          {success ? (
            <div className="rounded-full bg-green-100 p-5">
              <CheckCircle2 className="text-green-600" size={70} />
            </div>
          ) : (
            <div className="rounded-full bg-red-100 p-5">
              <XCircle className="text-red-600" size={70} />
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold">
          {success ? "Email Verified 🎉" : "Verification Failed"}
        </h1>

        <p className="mt-4 text-gray-500">{message}</p>

        <Link
          href="/Auth/login"
          className="mt-8 inline-flex rounded-xl bg-orange-600 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-orange-700 hover:shadow-lg active:scale-95"
        >
          Go to Login
        </Link>
      </div>
    </main>
  );
}
