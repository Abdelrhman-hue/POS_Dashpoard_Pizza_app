
import { auth } from "@/auth";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import ProfileContent from "@/components/ui/ProfileContent";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/Auth/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      phone: true,
      streetAddress: true,
      postalCode: true,
      city: true,
      country: true,
    },
  });

  if (!user) {
    redirect("/Auth/login");
  }

  return <ProfileContent user={user} />;
}
