import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Role } from "@/generated/prisma/client";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export const getCurrentViewer = async () => {
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

  const clerkUser = await currentUser();

  const primaryEmail = clerkUser?.primaryEmailAddress?.emailAddress || null;
  const fallbackName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    null;
  const fallbackPhone = clerkUser?.phoneNumbers?.[0]?.phoneNumber || null;
  const shouldBeAdmin = primaryEmail ? isAdminEmail(primaryEmail) : false;

  const dbUser = primaryEmail
    ? await prisma.user.upsert({
        where: { clerkId: userId },
        update: {
          email: primaryEmail,
          name: fallbackName,
          phone: fallbackPhone,
          ...(shouldBeAdmin ? { role: Role.ADMIN } : {}),
        },
        create: {
          clerkId: userId,
          email: primaryEmail,
          name: fallbackName,
          phone: fallbackPhone,
          role: shouldBeAdmin ? Role.ADMIN : Role.USER,
        },
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
      })
    : await prisma.user.findUnique({
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
      });

  const latestDriverApplication = dbUser?.driverApplications[0] ?? null;
  const isDriver =
    dbUser?.role === "DRIVER" || dbUser?.driverProfile?.status === "APPROVED";
  const hasDriverApplication = Boolean(latestDriverApplication);
  const displayName =
    dbUser?.name ||
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    null;
  const displayEmail =
    dbUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || null;
  const isAdmin =
    dbUser?.role === Role.ADMIN || (displayEmail ? isAdminEmail(displayEmail) : false);

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
