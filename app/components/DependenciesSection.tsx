"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const EASE = "cubic-bezier(0, 0, 0.2, 1)";

const TYPING_MS       = 53;  // ms per character — "system printing" feel
const TYPING_PAUSE_MS = 120; // pause between platforms

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
  {
    id: "other",
    index: "04",
    name: "OTHER",
    href: "/platforms/other",
    overview: "Cross-domain applied research",
    docs: [
      { name: "Applied Research Overview",    type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Cross-Domain Patent Filing",   type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
      { name: "Research Framework",           type: "PDF", size: "0.0 MB", href: "#" }, // TODO: real file
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

  // Exclusive accordion — at most one platform open at a time. null = all collapsed.
  const [openId, setOpenId] = useState<string | null>(null);

  // revealed[i] = true when row i should fade+rise in.
  const [revealed, setRevealed] = useState([false, false, false, false]);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Typing animation
  const [typedChars, setTypedChars] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const [cursorOn, setCursorOn] = useState(true);
  // Which row the cursor is currently on. Stays on the last-typed row during inter-platform
  // pauses so the cursor never disappears mid-sequence. -1 = no cursor.
  const [cursorPlatformIdx, setCursorPlatformIdx] = useState(-1);

  // Toggle button hover — inline styles win over Tailwind classes in CSS specificity,
  // so hover state must be tracked in React state and applied as inline style.
  const [hoveredButtonId, setHoveredButtonId] = useState<string | null>(null);

  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cursorRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Viewport entrance: reveal rows and type names sequentially.
  // If the section exits the viewport before typing finishes, complete instantly
  // so no row is left with text half-written.
  useEffect(() => {
    if (reducedMotion) {
      setRevealed([true, true, true, true]);
      setTypedChars([
        PLATFORMS[0].name.length,
        PLATFORMS[1].name.length,
        PLATFORMS[2].name.length,
        PLATFORMS[3].name.length,
      ]);
      return;
    }

    const el = sectionRef.current;
    if (!el) return;

    // Snaps the animation to its final state immediately.
    const completeInstantly = () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
      if (cursorRef.current) {
        clearInterval(cursorRef.current);
        cursorRef.current = null;
      }
      setCursorOn(false);
      setCursorPlatformIdx(-1);
      setRevealed([true, true, true, true]);
      setTypedChars([
        PLATFORMS[0].name.length,
        PLATFORMS[1].name.length,
        PLATFORMS[2].name.length,
        PLATFORMS[3].name.length,
      ]);
    };

    // Mutable flag inside the closure — avoids a ref dependency.
    const state = { typingStarted: false };

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting;

        if (isVisible && !state.typingStarted) {
          state.typingStarted = true;
          const timers: ReturnType<typeof setTimeout>[] = [];

          cursorRef.current = setInterval(() => setCursorOn((v) => !v), 530);

          PLATFORMS.forEach((platform, pIdx) => {
            const startDelay = typingStartMs(pIdx);

            // Move cursor to this platform and reveal the row at the same moment.
            // Keeping cursorPlatformIdx pinned to the current platform during the
            // inter-platform pause (120ms) prevents the cursor from blinking out.
            timers.push(
              setTimeout(() => {
                setCursorPlatformIdx(pIdx);
                setRevealed((prev) => {
                  const next: [boolean, boolean, boolean, boolean] = [prev[0], prev[1], prev[2], prev[3]];
                  next[pIdx] = true;
                  return next;
                });
              }, startDelay)
            );

            for (let c = 1; c <= platform.name.length; c++) {
              const charDelay   = startDelay + c * TYPING_MS;
              const charCount   = c;
              const platformIdx = pIdx;
              const isLastChar  = pIdx === PLATFORMS.length - 1 && c === platform.name.length;

              timers.push(
                setTimeout(() => {
                  setTypedChars((prev) => {
                    const next: [number, number, number, number] = [prev[0], prev[1], prev[2], prev[3]];
                    next[platformIdx] = charCount;
                    return next;
                  });
                  if (isLastChar) {
                    if (cursorRef.current) {
                      clearInterval(cursorRef.current);
                      cursorRef.current = null;
                    }
                    setCursorOn(false);
                    setCursorPlatformIdx(-1);
                  }
                }, charDelay)
              );
            }
          });

          timersRef.current = timers;

        } else if (!isVisible && state.typingStarted) {
          // Section scrolled away before typing finished — snap to complete.
          completeInstantly();
          observer.disconnect();
        }
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
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      style={{
        backgroundColor: "var(--color-void)",
        paddingTop: "clamp(140px, 18dvh, 200px)",
        paddingBottom: "37dvh",
        paddingLeft: "clamp(24px, 6vw, 80px)",
        paddingRight: "clamp(24px, 6vw, 80px)",
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
          margin: "0 0 clamp(56px, 7dvh, 88px)",
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
        const isOpen      = openId === platform.id;
        const isRevealed  = revealed[idx];
        const showCursor  = !reducedMotion && idx === cursorPlatformIdx && cursorOn;
        const btnHovered  = hoveredButtonId === platform.id;

        // Shared character + cursor rendering — used in both Link and span branches.
        const nameChars = (
          <>
            {platform.name.split("").map((char, ci) => (
              <span
                key={ci}
                style={{
                  color: reducedMotion || ci < typedChars[idx] ? "inherit" : "transparent",
                }}
              >
                {char}
              </span>
            ))}
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
          </>
        );

        const nameBaseStyle = {
          flex: 1,
          minWidth: 0,
          fontFamily: "var(--font-display)",
          fontSize: "clamp(36px, 6vw, 88px)",
          fontWeight: 450,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
          gap: "0.22em",
        };

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
                padding: "clamp(28px, 3.8dvh, 52px) 0",
              }}
            >
              {/* Numeric index — brightens when row is open to signal active state */}
              <span
                aria-hidden="true"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "clamp(12px, 1vw, 16px)",
                  color: isOpen ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.22)",
                  transition: `color 80ms ${EASE}`,
                  flexShrink: 0,
                  width: "2.5rem",
                  textAlign: "right",
                  userSelect: "none",
                  lineHeight: 1,
                }}
              >
                {platform.index}.
              </span>

              {/* ZONE A — Platform name: navigates to platform page.
                  Hover brightens name and reveals ↗. Never expands the accordion.
                  When open, inline opacity:1 overrides the opacity-55 class. */}
              <Link
                href={platform.href}
                className="group flex items-baseline"
                style={{ ...nameBaseStyle, textDecoration: "none" }}
              >
                <span
                  className="opacity-55 group-hover:opacity-100 transition-opacity duration-[80ms] ease-[cubic-bezier(0,0,0.2,1)]"
                  style={{
                    color: "var(--color-text)",
                    ...(isOpen && { opacity: 1 }),
                  }}
                >
                  {nameChars}
                </span>
                <span
                  aria-hidden="true"
                  className="opacity-0 group-hover:opacity-50 transition-opacity duration-[80ms] ease-[cubic-bezier(0,0,0.2,1)]"
                  style={{ fontSize: "0.38em", color: "var(--color-text)", lineHeight: 1 }}
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

              {/* ZONE B — Toggle: 44×44 transparent tap area, 40×40 visual box inside.
                  Hover state via React state (not Tailwind) — inline styles have higher
                  CSS specificity than class-based rules, so Tailwind hover classes
                  cannot override inline color/border. */}
              <button
                type="button"
                onClick={() => toggle(platform.id)}
                aria-expanded={isOpen}
                aria-controls={`deps-${platform.id}`}
                aria-label={isOpen ? `Collapse ${platform.name}` : `Expand ${platform.name}`}
                onMouseEnter={() => setHoveredButtonId(platform.id)}
                onMouseLeave={() => setHoveredButtonId(null)}
                style={{
                  flexShrink: 0,
                  width: "44px",
                  height: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: "40px",
                    height: "40px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: `1px solid ${btnHovered ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)"}`,
                    color: btnHovered ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.5)",
                    transition: `color 80ms ${EASE}, border-color 80ms ${EASE}`,
                    fontFamily: "var(--font-mono)",
                    fontSize: "20px",
                    lineHeight: 1,
                  }}
                >
                  {isOpen ? "−" : "+"}
                </span>
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
                    paddingBottom: "clamp(48px, 6dvh, 80px)",
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

                        {/* Disabled placeholder — opacity signals unavailability at a glance */}
                        <button
                          type="button"
                          disabled
                          aria-label={`${doc.name} — not yet available`}
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
                            opacity: 0.35,
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
