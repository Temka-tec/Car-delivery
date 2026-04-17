import { redirect } from "next/navigation";
import { getCurrentViewer } from "@/lib/current-viewer";
import { FleetSection } from "./_components/FleetSection";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { HeroSection } from "./_components/HeroSection";

export const dynamic = "force-dynamic";

export default async function Home() {
  const viewer = await getCurrentViewer();

  if (viewer.isAdmin) {
    redirect("/admin/driver-applications");
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <HeroSection />

      <FleetSection />
      <Footer />
    </main>
  );
}
