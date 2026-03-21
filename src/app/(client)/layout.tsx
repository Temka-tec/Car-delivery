import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alphard Rentals",
  description: "Жолоочтой машин түрээслэлийн платформ",
};

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
