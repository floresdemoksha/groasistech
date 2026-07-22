"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollIndicator } from "./ScrollIndicator";

const EASE = "cubic-bezier(0, 0, 0.2, 1)";

// Total pinned section height. (SECTION_HEIGHT_VH - 100) dvh of scroll travel
// happens while the section is pinned — moderate weight, not extreme.
const SECTION_HEIGHT_VH = 420;

const WORDS = [
  "Frontier", "hardware", "built", "on", "sixty", "granted", "patents.",
  "Propellantless", "propulsion,", "light-based", "cellular", "reengineering,",
  "next-generation", "communication", "infrastructure.",
];

// Word illuminates when scroll progress (0–1) crosses this threshold.
// Spreads from ~6% to ~88%, leaving a small buffer at start and end.
const threshold = (idx: number) => (idx + 1) / (WORDS.length + 2);

export function StatementSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return;
      setProgress(Math.max(0, Math.min(1, -rect.top / scrollable)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion]);

  // Visible from the moment the section enters the viewport; fades near the end.
  // In reducedMotion mode progress is always 0, so we derive visibility directly.
  const indicatorVisible = reducedMotion ? true : progress < 0.96;

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      style={{
        // reducedMotion: no pinning — section is just one viewport tall, static.
        minHeight: reducedMotion ? undefined : `${SECTION_HEIGHT_VH}dvh`,
        position: "relative",
        backgroundColor: "var(--color-void)",
      }}
    >
      <div
        style={{
          position: reducedMotion ? "relative" : "sticky",
          top: 0,
          height: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 clamp(24px, 6vw, 80px)",
        }}
      >
        <span
          style={{
            display: "block",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-text-muted)",
            marginBottom: "var(--space-4)",
          }}
        >
          Statement
        </span>

        <p
          style={{
            maxWidth: "820px",
            fontFamily: "var(--font-display)",
            fontSize: "clamp(28px, 3.5vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            lineHeight: 1.35,
            color: "var(--color-text)",
            margin: 0,
            textAlign: "center",
            textWrap: "balance",
          }}
        >
          {reducedMotion
            ? WORDS.join(" ")
            : WORDS.map((word, idx) => (
                <span
                  key={idx}
                  style={{
                    opacity: progress >= threshold(idx) ? 1 : 0.22,
                    transition: `opacity 100ms ${EASE}`,
                  }}
                >
                  {word}
                  {idx < WORDS.length - 1 ? " " : ""}
                </span>
              ))}
        </p>

        <ScrollIndicator visible={indicatorVisible} />
      </div>
    </section>
  );
}
