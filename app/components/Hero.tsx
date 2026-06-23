import { Header } from "./Header";
import { HeroVideo } from "./HeroVideo";
import { ScrollIndicator } from "./ScrollIndicator";

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function Hero({ videoSrc, posterSrc }: HeroProps) {
  return (
    <section className="relative isolate h-[115dvh] w-full overflow-hidden">
      {/* Fondo: video o placeholder */}
      <HeroVideo videoSrc={videoSrc} posterSrc={posterSrc} />

      {/* Header sticky */}
      <Header />

      {/* Contenido central */}
      <div className="relative z-10 flex h-dvh flex-col items-center justify-center px-[var(--space-4)]">
        <h1
          className="max-w-4xl text-center text-4xl font-semibold leading-tight tracking-tight text-[var(--color-text)] md:text-5xl lg:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Frontier technology. Sovereign by design.
    
          <br />
        </h1>
      </div>

      {/* Indicador de scroll */}
      <ScrollIndicator />
    </section>
  );
}
