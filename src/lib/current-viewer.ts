import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const getCurrentViewer = async () => {
  const { userId } = await auth();

  if (!userId) {
    return {
      isSignedIn: false,
      isDriver: false,
      clerkId: null,
      user: null,
      driverProfile: null,
      latestDriverApplication: null,
      displayName: null,
      displayEmail: null,
    };
  }

  const [clerkUser, dbUser] = await Promise.all([
    currentUser(),
    prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        driverProfile: {
          include: {
            car: true,
          },
        },
        driverApplications: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    }),
  ]);

  const latestDriverApplication = dbUser?.driverApplications[0] ?? null;
  const isDriver =
    dbUser?.role === "DRIVER" || dbUser?.driverProfile?.status === "APPROVED";
  const displayName =
    dbUser?.name ||
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    null;
  const displayEmail =
    dbUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || null;

  return {
    isSignedIn: true,
    isDriver,
    clerkId: userId,
    user: dbUser,
    driverProfile: dbUser?.driverProfile ?? null,
    latestDriverApplication,
    displayName,
    displayEmail,
  };
};
