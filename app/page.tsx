import { Hero } from "./components/Hero";
import { StatementSection } from "./components/StatementSection";
import { DependenciesSection } from "./components/DependenciesSection";
import { ClosingSection } from "./components/ClosingSection";

export default function Home() {
  return (
    <main>
      <Hero
        videoSrc="/hero-bg.mp4"
        posterSrc="/hero-bg-poster.jpg"
      />
      <StatementSection />
      <DependenciesSection />
      <ClosingSection />
    </main>
  );
}
