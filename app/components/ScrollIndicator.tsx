"use client";

import { useEffect, useState } from "react";

interface Props {
  // When provided, visibility is controlled externally (e.g. progress-based).
  // When omitted, the component self-manages: visible only while scrollY < 100px.
  visible?: boolean;
}

export function ScrollIndicator({ visible: visibleProp }: Props) {
  const [internalVisible, setInternalVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", motionHandler);

    // Scroll listener only when self-managed (Hero). External callers supply visible prop.
    // deps=[] is intentional: the mode (self-managed vs external) is fixed per mount.
    if (visibleProp === undefined) {
      const handleScroll = () => setInternalVisible(window.scrollY < 100);
      window.addEventListener("scroll", handleScroll, { passive: true });
      return () => {
        mq.removeEventListener("change", motionHandler);
        window.removeEventListener("scroll", handleScroll);
      };
    }

    return () => mq.removeEventListener("change", motionHandler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const isVisible = visibleProp !== undefined ? visibleProp : internalVisible;

  return (
    <div
      className={`absolute bottom-[var(--space-4)] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-opacity ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      style={{
        transitionDuration: "var(--timing-base)",
        transitionTimingFunction: "var(--easing-out)",
      }}
      aria-hidden="true"
    >
      {/* Chevron — animates independently of the show/hide opacity on the outer div */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={`text-white ${
          prefersReducedMotion ? "opacity-100" : "animate-scroll-hint"
        }`}
      >
        <path d="M1 4L6 9L11 4" />
      </svg>

      <style jsx>{`
        /*
         * Downward nudge (5px) with opacity rise, then return, then pause.
         * Per-keyframe animation-timing-function removes the linear V-shape
         * artifact at the loop restart: the chevron now eases out on both
         * strokes and rests at the origin for ~30% of the cycle before repeating.
         */
        @keyframes scroll-hint {
          0%, 15% {
            opacity: 0.5;
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
          50% {
            opacity: 1;
            transform: translateY(5px);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
          80%, 100% {
            opacity: 0.5;
            transform: translateY(0);
          }
        }

        .animate-scroll-hint {
          animation: scroll-hint 2s linear infinite;
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
