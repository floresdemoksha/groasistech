import { Hero } from "./components/Hero";

export default function Home() {
  return (
    <main>
      <Hero
        videoSrc="/hero-bg.mp4"
        posterSrc="/hero-bg-poster.jpg"
      />

      {/* Placeholder para verificar scroll */}
      <section className="h-screen bg-[var(--color-vault)] flex items-center justify-center">
        <p className="text-[var(--color-text-muted)] font-mono text-sm">
          // Contenido adicional
        </p>
      </section>
    </main>
  );
}
