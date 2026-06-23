"use client";

import { useEffect, useState } from "react";

export function ScrollIndicator() {
  const [visible, setVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);

    const motionHandler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    motionQuery.addEventListener("change", motionHandler);

    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      motionQuery.removeEventListener("change", motionHandler);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`absolute bottom-[var(--space-4)] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        transitionDuration: "var(--timing-base)",
        transitionTimingFunction: "var(--easing-out)",
      }}
      aria-hidden="true"
    >
      {/* Linea vertical estilo HUD */}
      <div className="w-px h-8 bg-[var(--color-border)]" />

      {/* Flecha */}
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className={`text-[var(--color-text-muted)] ${
          prefersReducedMotion ? "" : "animate-scroll-hint"
        }`}
      >
        <path d="M1 4L6 9L11 4" />
      </svg>

      <style jsx>{`
        @keyframes scroll-hint {
          0%,
          100% {
            transform: translateY(0);
            opacity: 0.6;
          }
          50% {
            transform: translateY(4px);
            opacity: 1;
          }
        }

        .animate-scroll-hint {
          animation: scroll-hint 2s var(--easing-out) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-scroll-hint {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
