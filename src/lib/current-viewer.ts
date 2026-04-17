import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import type { Prisma } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

const currentViewerInclude = {
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
} satisfies Prisma.UserInclude;

type CurrentViewerUser = Prisma.UserGetPayload<{
  include: typeof currentViewerInclude;
}>;

export type CurrentViewer = {
  isSignedIn: boolean;
  isDriver: boolean;
  isAdmin: boolean;
  hasDriverApplication: boolean;
  clerkId: string | null;
  user: CurrentViewerUser | null;
  driverProfile: CurrentViewerUser["driverProfile"] | null;
  latestDriverApplication:
    | CurrentViewerUser["driverApplications"][number]
    | null;
  displayName: string | null;
  displayEmail: string | null;
};

export const getCurrentViewer = async (): Promise<CurrentViewer> => {
  const { userId } = await auth();

  if (!userId) {
    return {
      isSignedIn: false,
      isDriver: false,
      isAdmin: false,
      hasDriverApplication: false,
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
      include: currentViewerInclude,
    }),
  ]);

  const latestDriverApplication = dbUser?.driverApplications[0] ?? null;
  const isDriver =
    dbUser?.role === Role.DRIVER || dbUser?.driverProfile?.status === "APPROVED";
  const hasDriverApplication = Boolean(latestDriverApplication);
  const displayName =
    dbUser?.name ||
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    null;
  const displayEmail =
    dbUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || null;
  const isAdmin = dbUser?.role === Role.ADMIN;

  return {
    isSignedIn: true,
    isDriver,
    isAdmin,
    hasDriverApplication,
    clerkId: userId,
    user: dbUser,
    driverProfile: dbUser?.driverProfile ?? null,
    latestDriverApplication,
    displayName,
    displayEmail,
  };
};
