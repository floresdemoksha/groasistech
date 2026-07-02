"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0, 0, 0.2, 1)";

const TYPING_MS = 53;        // ms per character — "system printing" feel
const TYPING_PAUSE_MS = 120; // pause between platforms (cursor blinks once before next starts)

// PLACEHOLDER DOCS — none of these files exist yet.
// Replace name, type, size, and href with verified documents before publishing.
const PLATFORMS = [
  {
    id: "gt-aero",
    index: "01",
    name: "GT-AERO",
    href: "/platforms/gt-aero",
    overview: "Strategic automation and propulsion",
    docs: [
      { name: "GT-AERO System Whitepaper",  type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Propulsion Patent Filing",    type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Technical Specifications",    type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
    ],
  },
  {
    id: "photon",
    index: "02",
    name: "PHOTON",
    href: "/platforms/photon",
    overview: "Cellular reengineering through light",
    docs: [
      { name: "PHOTON Research Whitepaper",  type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Biomodulation Patent Filing", type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Clinical Validation Report",  type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
    ],
  },
  {
    id: "teleco",
    index: "03",
    name: "TELECO",
    href: "/platforms/teleco",
    overview: "Next-generation communication infrastructure",
    docs: [
      { name: "TELECO Architecture Overview", type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Spectrum Patent Filing",        type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Infrastructure Specification",  type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
    ],
  },
];

// When typing is sequential, platform[i] starts after all previous ones finish + a pause.
const typingStartMs = (idx: number): number => {
  let delay = 0;
  for (let i = 0; i < idx; i++) {
    delay += PLATFORMS[i].name.length * TYPING_MS + TYPING_PAUSE_MS;
  }
  return delay;
};

export function DependenciesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  // Multi-open accordion — each platform toggles independently.
  const [openIds, setOpenIds] = useState<Set<string>>(() => new Set(["gt-aero"]));

  // revealed[i] = true when row i should fade+rise in (tied to its typing start).
  const [revealed, setRevealed] = useState([false, false, false]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Typing animation
  const [typedChars, setTypedChars] = useState<[number, number, number]>([0, 0, 0]);
  const [cursorOn, setCursorOn] = useState(true);

  const timersRef   = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cursorRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Viewport entrance: reveal rows and type names sequentially
  useEffect(() => {
    if (reducedMotion) {
      // Instant reveal — no typing, no stagger, no cursor
      setRevealed([true, true, true]);
      setTypedChars([
        PLATFORMS[0].name.length,
        PLATFORMS[1].name.length,
        PLATFORMS[2].name.length,
      ]);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();

        const timers: ReturnType<typeof setTimeout>[] = [];

        // Start cursor blink while typing is in progress
        cursorRef.current = setInterval(() => setCursorOn((v) => !v), 530);

        PLATFORMS.forEach((platform, pIdx) => {
          const startDelay = typingStartMs(pIdx);

          // Row fades+rises in at the same moment its typing begins
          timers.push(
            setTimeout(() => {
              setRevealed((prev) => {
                const next: [boolean, boolean, boolean] = [prev[0], prev[1], prev[2]];
                next[pIdx] = true;
                return next;
              });
            }, startDelay)
          );

          // Schedule each character reveal
          for (let c = 1; c <= platform.name.length; c++) {
            const charDelay = startDelay + c * TYPING_MS;
            const charCount = c;
            const platformIdx = pIdx;
            const isLastChar = pIdx === PLATFORMS.length - 1 && c === platform.name.length;

            timers.push(
              setTimeout(() => {
                setTypedChars((prev) => {
                  const next: [number, number, number] = [prev[0], prev[1], prev[2]];
                  next[platformIdx] = charCount;
                  return next;
                });
                // Stop cursor after the final character of the final platform
                if (isLastChar) {
                  if (cursorRef.current) {
                    clearInterval(cursorRef.current);
                    cursorRef.current = null;
                  }
                  setCursorOn(false);
                }
              }, charDelay)
            );
          }
        });

        timersRef.current = timers;
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      timersRef.current.forEach(clearTimeout);
      if (cursorRef.current) clearInterval(cursorRef.current);
    };
  }, [reducedMotion]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Platform currently mid-typing (first one with chars > 0 but not finished).
  // -1 when typing is idle (before start or fully done).
  const currentTypingIdx = typedChars.findIndex(
    (n, i) => n > 0 && n < PLATFORMS[i].name.length
  );

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: "var(--color-void)",
        padding: "clamp(32px, 4dvh, 56px) clamp(24px, 6vw, 80px)",
      }}
    >
      {/* Section label */}
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontWeight: 400,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--color-text-muted)",
          margin: "0 0 clamp(32px, 5dvh, 56px)",
        }}
      >
        Our Dependencies
      </p>

      {/* Top border */}
      <div
        aria-hidden="true"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
      />

      {PLATFORMS.map((platform, idx) => {
        const isOpen = openIds.has(platform.id);
        const isRevealed = revealed[idx];
        const showCursor = !reducedMotion && idx === currentTypingIdx && cursorOn;

        return (
          <div
            key={platform.id}
            style={{
              opacity: isRevealed ? 1 : 0,
              transform: isRevealed ? "none" : "translateY(18px)",
              transition: reducedMotion
                ? "none"
                : `opacity 120ms ${EASE}, transform 120ms ${EASE}`,
            }}
          >
            {/* ── Row header — two distinct click zones ── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "clamp(12px, 1.8dvh, 20px) 0",
              }}
            >
              {/* Numeric index — decorative, not interactive */}
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(12px, 1vw, 16px)",
                  color: "rgba(255,255,255,0.22)",
                  flexShrink: 0,
                  width: "2.5rem",
                  textAlign: "right",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {platform.index}.
              </span>

              {/* ZONE A — Platform name: NAVIGATES to platform page.
                  Characters rendered in full always (layout-stable), revealed by color.
                  Hover shows ↗ and brightens. Never expands the accordion. */}
              <Link
                href={platform.href}
                className="group flex items-baseline"
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(36px, 6vw, 88px)",
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  textDecoration: "none",
                  gap: "0.22em",
                }}
              >
                <span
                  className="opacity-55 group-hover:opacity-100 transition-opacity duration-[80ms] ease-[cubic-bezier(0,0,0.2,1)]"
                  style={{ color: "var(--color-text)" }}
                >
                  {/* All characters always in DOM — color transparent until typed.
                      This keeps the row height stable (no reflow during typing). */}
                  {platform.name.split("").map((char, ci) => (
                    <span
                      key={ci}
                      style={{
                        color:
                          reducedMotion || ci < typedChars[idx]
                            ? "inherit"
                            : "transparent",
                      }}
                    >
                      {char}
                    </span>
                  ))}
                  {/* Blinking cursor — only on the platform currently being typed */}
                  {showCursor && (
                    <span
                      aria-hidden="true"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7em",
                        color: "var(--color-accent)",
                        marginLeft: "0.06em",
                        verticalAlign: "baseline",
                      }}
                    >
                      |
                    </span>
                  )}
                </span>

                {/* ↗ reveals on hover to signal external navigation */}
                <span
                  aria-hidden="true"
                  className="opacity-0 group-hover:opacity-50 transition-opacity duration-[80ms] ease-[cubic-bezier(0,0,0.2,1)]"
                  style={{
                    fontSize: "0.38em",
                    color: "var(--color-text)",
                    lineHeight: 1,
                  }}
                >
                  ↗
                </span>
              </Link>

              {/* /0x index label — decorative */}
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(11px, 0.85vw, 14px)",
                  color: "rgba(255,255,255,0.18)",
                  flexShrink: 0,
                  letterSpacing: "0.04em",
                }}
              >
                /{platform.index}
              </span>

              {/* ZONE B — Toggle button: EXPANDS/COLLAPSES this accordion independently.
                  Never navigates. Each platform opens/closes on its own. */}
              <button
                type="button"
                onClick={() => toggle(platform.id)}
                aria-expanded={isOpen}
                aria-controls={`deps-${platform.id}`}
                aria-label={isOpen ? `Collapse ${platform.name}` : `Expand ${platform.name}`}
                className="flex items-center justify-center hover:border-white/30 hover:text-white transition-colors duration-[80ms] ease-[cubic-bezier(0,0,0.2,1)]"
                style={{
                  flexShrink: 0,
                  width: "40px",
                  height: "40px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "20px",
                  lineHeight: 1,
                }}
              >
                {isOpen ? "−" : "+"}
              </button>
            </div>

            {/* ── Accordion content — grid-template-rows animation ── */}
            <div
              id={`deps-${platform.id}`}
              role="region"
              aria-label={`${platform.name} details`}
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: reducedMotion ? "none" : `grid-template-rows 150ms ${EASE}`,
              }}
            >
              <div style={{ minHeight: 0, overflow: "hidden" }}>
                {/* paddingLeft mirrors (index width + gap) so overview text
                    starts at the same column as the platform name above. */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "clamp(24px, 4vw, 64px)",
                    paddingLeft: "calc(2.5rem + 12px)",
                    paddingBottom: "clamp(24px, 3.5dvh, 48px)",
                    opacity: isOpen ? 1 : 0,
                    transition: reducedMotion
                      ? "none"
                      : `opacity ${isOpen ? "150ms" : "60ms"} ${EASE} ${isOpen ? "80ms" : "0ms"}`,
                  }}
                >
                  {/* Left — Overview */}
                  <div style={{ flex: "1 1 340px", minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(15px, 1.3vw, 20px)",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.4,
                        color: "var(--color-text)",
                        margin: 0,
                      }}
                    >
                      {platform.overview}
                    </p>
                    {/* TODO: insert verified long-form description paragraph here when copy is ready */}
                  </div>

                  {/* Right — Supporting Docs */}
                  <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        borderBottom: "1px solid rgba(255,255,255,0.12)",
                        paddingBottom: "8px",
                        marginBottom: "2px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.35)",
                        }}
                      >
                        Supporting Docs
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          letterSpacing: "0.04em",
                          color: "rgba(255,255,255,0.2)",
                        }}
                      >
                        {String(platform.docs.length).padStart(2, "0")} Available
                      </span>
                    </div>

                    {/* PLACEHOLDER doc rows — replace with real files before publishing */}
                    {platform.docs.map((doc, dIdx) => (
                      <div
                        key={dIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          borderBottom: "1px solid rgba(255,255,255,0.06)",
                          padding: "10px 0",
                        }}
                      >
                        <svg
                          aria-hidden="true"
                          width="14"
                          height="16"
                          viewBox="0 0 14 16"
                          fill="none"
                          strokeWidth="1"
                          style={{ flexShrink: 0, stroke: "rgba(255,255,255,0.3)" }}
                        >
                          <path d="M2 1h7l3 3v11H2V1z" />
                          <path d="M9 1v3h3" />
                        </svg>

                        <span
                          style={{
                            fontFamily: "var(--font-display)",
                            fontSize: "13px",
                            color: "rgba(255,255,255,0.65)",
                            flex: 1,
                            minWidth: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {doc.name}
                        </span>

                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "rgba(255,255,255,0.25)",
                            flexShrink: 0,
                            letterSpacing: "0.02em",
                          }}
                        >
                          {doc.type} — {doc.size}
                        </span>

                        <button
                          type="button"
                          title="Próximamente"
                          aria-label={`${doc.name} — próximamente`}
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.6)",
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "not-allowed",
                            flexShrink: 0,
                          }}
                        >
                          Download ↓
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              aria-hidden="true"
              style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.12)" }}
            />
          </div>
        );
      })}
    </section>
  );
}
