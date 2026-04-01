import "server-only";

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || process.env.DRIVER_APPLICATION_TO_EMAIL || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const isAdminEmail = (email: string | null | undefined) => {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.trim().toLowerCase());
};

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
