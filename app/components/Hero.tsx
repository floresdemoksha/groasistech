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
      <div
        className="relative z-10 flex h-dvh flex-col items-center justify-center"
        style={{ padding: "0 clamp(24px, 6vw, 80px)" }}
      >
        <h1
          className="max-w-4xl text-center leading-tight tracking-tight text-[var(--color-text)]"
          style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "clamp(32px, 6vw, 64px)" }}
        >
          Frontier technology. Sovereign by design.
        </h1>
      </div>

      {/* Indicador de scroll */}
      <ScrollIndicator />
    </section>
  );
}
