import { Hero } from "./components/Hero";
import { StatementSection } from "./components/StatementSection";

export default function Home() {
  return (
    <main>
      <Hero
        videoSrc="/hero-bg.mp4"
        posterSrc="/hero-bg-poster.jpg"
      />
      <StatementSection />
    </main>
  );
}
