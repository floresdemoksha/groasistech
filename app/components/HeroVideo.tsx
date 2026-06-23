"use client";

import { useEffect, useState } from "react";

interface HeroVideoProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function HeroVideo({ videoSrc, posterSrc }: HeroVideoProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const showVideo = videoSrc && !prefersReducedMotion;

  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {/* Fondo base void */}
      <div className="absolute inset-0 bg-[var(--color-void)]" />

      {/* Video (cuando disponible y motion permitido) */}
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterSrc}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Poster estatico (fallback o reduced motion) */}
      {posterSrc && !showVideo && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${posterSrc})` }}
        />
      )}

      {/* Scrim: degradado superior para header */}
      <div
        className="absolute inset-x-0 top-0 h-32"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 100%)",
        }}
      />

      {/* Scrim: vineta central para legibilidad del titular */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 70%, rgba(0, 0, 0, 0.7) 100%)",
        }}
      />
    </div>
  );
}
