"use client";

import { useClerk } from "@clerk/nextjs";

type SignOutActionProps = {
  className?: string;
  label?: string;
  redirectUrl?: string;
};

export const SignOutAction = ({
  className,
  label = "Гарах",
  redirectUrl = "/",
}: SignOutActionProps) => {
  const { signOut } = useClerk();

  return (
    <button
      type="button"
      onClick={() => signOut({ redirectUrl })}
      className={className}
    >
      {label}
    </button>
  );
};
