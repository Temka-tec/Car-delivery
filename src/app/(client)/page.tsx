import { FleetSection } from "./_components/FleetSection";
import { Footer } from "./_components/Footer";
import { Header } from "./_components/Header";
import { HeroSection } from "./_components/HeroSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <Header />
      <HeroSection />

      <FleetSection />
      <Footer />
    </main>
  );
}
