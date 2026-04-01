"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminApplicationActionsProps = {
  applicationId: string;
  currentStatus: string;
};

export const AdminApplicationActions = ({
  applicationId,
  currentStatus,
}: AdminApplicationActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const updateStatus = async (status: "APPROVED" | "REJECTED" | "REVIEWING") => {
    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/admin/driver-applications/${applicationId}/review`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        const message = await response.text();
        window.alert(message || "Төлөв шинэчлэх үед алдаа гарлаа.");
        return;
      }

      router.refresh();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={isLoading || currentStatus === "APPROVED"}
        onClick={() => updateStatus("APPROVED")}
        className="rounded-lg bg-[#3ECF8E] px-4 py-2 text-sm font-medium text-[#04130B] transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Approve
      </button>
      <button
        type="button"
        disabled={isLoading || currentStatus === "REVIEWING"}
        onClick={() => updateStatus("REVIEWING")}
        className="rounded-lg border border-[rgba(201,168,76,0.3)] px-4 py-2 text-sm text-[var(--color-gold)] transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reviewing
      </button>
      <button
        type="button"
        disabled={isLoading || currentStatus === "REJECTED"}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-lg bg-[rgba(248,113,113,0.12)] px-4 py-2 text-sm text-[#F87171] transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
};
