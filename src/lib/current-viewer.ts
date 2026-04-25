import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Role } from "@/generated/prisma/client";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

const buildClerkName = (clerkUser: Awaited<ReturnType<typeof currentUser>>) =>
  clerkUser?.fullName ||
  [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
  null;

const buildDriverApplicationName = (
  application: {
    firstName: string;
    lastName: string;
  } | null,
) =>
  application
    ? [application.lastName, application.firstName].filter(Boolean).join(" ").trim() || null
    : null;

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
  const fallbackName = buildClerkName(clerkUser);
  const fallbackPhone = clerkUser?.phoneNumbers?.[0]?.phoneNumber || null;
  const shouldBeAdmin = primaryEmail ? isAdminEmail(primaryEmail) : false;

  let dbUser = await prisma.user.findUnique({
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

  if (!dbUser && primaryEmail) {
    dbUser = await prisma.user.create({
      data: {
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
    });
  } else if (dbUser) {
    const nextEmail = primaryEmail || dbUser.email;
    const nextPhone = dbUser.phone || fallbackPhone;
    const nextName = dbUser.name || fallbackName;
    const nextRole = shouldBeAdmin ? Role.ADMIN : dbUser.role;
    const shouldUpdate =
      dbUser.email !== nextEmail ||
      dbUser.phone !== nextPhone ||
      dbUser.name !== nextName ||
      dbUser.role !== nextRole;

    if (shouldUpdate) {
      dbUser = await prisma.user.update({
        where: { clerkId: userId },
        data: {
          email: nextEmail,
          name: nextName,
          phone: nextPhone,
          role: nextRole,
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
      });
    }
  }

  const latestDriverApplication = dbUser?.driverApplications[0] ?? null;
  const isDriver =
    dbUser?.role === "DRIVER" || dbUser?.driverProfile?.status === "APPROVED";
  const hasDriverApplication = Boolean(latestDriverApplication);
  const driverDisplayName = buildDriverApplicationName(latestDriverApplication);
  const displayName =
    ((isDriver || hasDriverApplication) && driverDisplayName) ||
    dbUser?.name ||
    fallbackName ||
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
