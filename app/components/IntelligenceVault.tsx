"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";

type NavItem = {
  id: string;
  num?: string;
  name: string;
  desc: string;
  isPlatform?: boolean;
};

const PLATFORMS: NavItem[] = [
  { id: "gt-aero", num: "01", name: "GT-AERO", desc: "Strategic automation and propulsion",          isPlatform: true },
  { id: "photon",  num: "02", name: "PHOTON",  desc: "Cellular reengineering through light",         isPlatform: true },
  { id: "teleco",  num: "03", name: "TELECO",  desc: "Next-generation communication infrastructure", isPlatform: true },
  { id: "other",   num: "04", name: "OTHER",   desc: "Cross-domain applied research",                isPlatform: true },
];

const PAGE_LINKS: NavItem[] = [
  { id: "who-we-are",        name: "Who We Are",        desc: "The research arm behind 60+ patents across three sovereign domains." },
  { id: "technical-archive", name: "Technical Archive", desc: "Patent registry. Analytical isometry." },
  { id: "deployments",       name: "Deployments",       desc: "Validation records. Field data." },
  { id: "contact",           name: "Contact",           desc: "Get in touch with the Groasis Tech team." },
];

const UTILITY_LINKS = [
  { id: "news-press",         name: "News / Press" },
  { id: "investor-relations", name: "Investor Relations" },
  { id: "privacy",            name: "Privacy" },
  { id: "legal-terms",        name: "Legal / Terms" },
];

const EASE = "cubic-bezier(0, 0, 0.2, 1)";

// Stagger timing constants — single source of truth.
// If you change these, PLATFORM_STAGGER_DONE_MS updates automatically.
const STAGGER_STEP_MS = 40;  // delay increment per item
const STAGGER_BASE_MS = 80;  // delay before the first item
const STAGGER_DUR_MS  = 120; // each item's animation duration

// Time (ms) after isOpen=true at which ALL platform wrappers have finished
// their stagger: last platform delay + duration + 30ms compositing buffer.
// Recalculates automatically if STAGGER_* constants or PLATFORMS.length change.
const PLATFORM_STAGGER_DONE_MS =
  STAGGER_BASE_MS + PLATFORMS.length * STAGGER_STEP_MS + STAGGER_DUR_MS + 30;

// Close-stagger constants — reverse of the open stagger.
// Items stagger OUT bottom-to-top; panel slides away only after all items are gone.
const STAGGER_CLOSE_DUR_MS = 60; // each item's fade-out duration (faster than open)
// Total stagger slots: DEPENDENCIES label + platforms + sep+label+links (EXPLORE) + sep+label+links (RESOURCES)
const STAGGER_ITEM_COUNT =
  1 + PLATFORMS.length + 1 + 1 + PAGE_LINKS.length + 1 + 1 + UTILITY_LINKS.length;
// Panel slide delay = time until the last item (idx 0) finishes closing
const STAGGER_CLOSE_DONE_MS =
  (STAGGER_ITEM_COUNT - 1) * STAGGER_STEP_MS + STAGGER_CLOSE_DUR_MS;

const CATEGORY_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
};

const PLATFORM_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "36px",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#ffffff",
  lineHeight: 1.1,
};

// Single style for all 8 navigation links (page links + utility links).
// Mono is reserved for section labels and technical metadata only.
const LINK_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "17px",
  fontWeight: 400,
  letterSpacing: "-0.01em",
  color: "#ffffff",
  lineHeight: 1.2,
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

export function IntelligenceVault({ isOpen, onClose, triggerRef }: Props) {
  const [selectedId, setSelectedId]           = useState<string>("gt-aero");
  const [indicatorTop, setIndicatorTop]       = useState(0);
  const [indicatorHeight, setIndicatorHeight] = useState(0);
  const [hoveredLinkId, setHoveredLinkId]     = useState<string | null>(null);
  const [reducedMotion, setReducedMotion]     = useState(false);
  const [hasStaggered, setHasStaggered]       = useState(false);

  const panelRef     = useRef<HTMLDivElement>(null);
  const platformRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wasOpenRef   = useRef(false);

  // ── prefers-reduced-motion ────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // ── scroll lock + reset on open ──────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) {
      setSelectedId("gt-aero");
      setHoveredLinkId(null);
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Esc key ───────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  // ── focus management ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      const delay = reducedMotion ? 0 : 160;
      const t = setTimeout(() => {
        const els = panelRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        els?.[0]?.focus();
      }, delay);
      return () => clearTimeout(t);
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen, reducedMotion, triggerRef]);

  // ── clear platform stagger after animation completes ─────────────────────
  // Once hasStaggered=true, platformWrap/platformInner return {} so the
  // delayed transition property is removed from the DOM. Without this, the
  // 120ms delay persists and interferes with the button's 80ms selection
  // opacity (the GT-AERO "half-de-emphasis" bug on mouse-out).
  useEffect(() => {
    if (!isOpen) {
      setHasStaggered(false);
      return;
    }
    const t = setTimeout(() => setHasStaggered(true), PLATFORM_STAGGER_DONE_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  // ── platform indicator measurement ───────────────────────────────────────
  // NOTE: wrapper divs for platforms use opacity-only (no transform), so
  // offsetParent resolution is unaffected in Chrome and btn.offsetTop is
  // correctly relative to the connector div (position:relative).
  useEffect(() => {
    const idx = PLATFORMS.findIndex((p) => p.id === selectedId);
    const btn = platformRefs.current[idx];
    if (!btn) return;
    setIndicatorTop(btn.offsetTop);
    setIndicatorHeight(btn.offsetHeight);
  }, [selectedId, isOpen]);

  // ── focus trap ────────────────────────────────────────────────────────────
  const trapFocus = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const els = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );
    if (els.length === 0) return;
    const first = els[0];
    const last  = els[els.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  const activeItem = PLATFORMS.find((p) => p.id === selectedId) ?? null;
  const dur = (ms: number) => (reducedMotion ? "0ms" : `${ms}ms`);

  // ── stagger helpers ───────────────────────────────────────────────────────

  // Reverse delay for the close stagger: last item (highest idx) closes first.
  const closeDelay = (idx: number) =>
    `${(STAGGER_ITEM_COUNT - 1 - idx) * STAGGER_STEP_MS}ms`;

  // For non-platform items: full opacity + translateY on the wrapper div.
  const staggerWrap = (idx: number): React.CSSProperties => {
    if (reducedMotion) return {};
    if (isOpen) {
      const d = `${idx * STAGGER_STEP_MS + STAGGER_BASE_MS}ms`;
      return {
        opacity: 1,
        transform: "translateY(0)",
        transition: `opacity ${STAGGER_DUR_MS}ms ${EASE} ${d}, transform ${STAGGER_DUR_MS}ms ${EASE} ${d}`,
      };
    }
    const d = closeDelay(idx);
    return {
      opacity: 0,
      transform: "translateY(6px)",
      transition: `opacity ${STAGGER_CLOSE_DUR_MS}ms ${EASE} ${d}, transform ${STAGGER_CLOSE_DUR_MS}ms ${EASE} ${d}`,
    };
  };

  // For platform items: ONLY opacity on the wrapper div.
  // Applying transform here would make Chrome treat the div as an offsetParent,
  // breaking btn.offsetTop measurement. The translateY goes on an inner span instead.
  // After hasStaggered=true the wrapper returns {} — no inline opacity or transition —
  // so the button's own 80ms opacity transition is the sole controller (no delay conflict).
  const platformWrap = (idx: number): React.CSSProperties => {
    if (reducedMotion || hasStaggered) return {};
    if (isOpen) {
      const d = `${idx * STAGGER_STEP_MS + STAGGER_BASE_MS}ms`;
      return {
        opacity: 1,
        transition: `opacity ${STAGGER_DUR_MS}ms ${EASE} ${d}`,
      };
    }
    const d = closeDelay(idx);
    return {
      opacity: 0,
      transition: `opacity ${STAGGER_CLOSE_DUR_MS}ms ${EASE} ${d}`,
    };
  };

  // translateY for the inner span inside each platform button.
  const platformInner = (idx: number): React.CSSProperties => {
    const base = { display: "flex", alignItems: "baseline", gap: "10px" } as const;
    if (reducedMotion || hasStaggered) return base;
    if (isOpen) {
      const d = `${idx * STAGGER_STEP_MS + STAGGER_BASE_MS}ms`;
      return {
        ...base,
        transform: "translateY(0)",
        transition: `transform ${STAGGER_DUR_MS}ms ${EASE} ${d}`,
      };
    }
    const d = closeDelay(idx);
    return {
      ...base,
      transform: "translateY(6px)",
      transition: `transform ${STAGGER_CLOSE_DUR_MS}ms ${EASE} ${d}`,
    };
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Intelligence Vault"
      aria-hidden={!isOpen}
      onKeyDown={trapFocus}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        display: "flex",
        pointerEvents: isOpen ? "auto" : "none",
      }}
    >
      {/* Left half — click closes. Fades in/out independently so it stays in sync with the panel slide. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          flex: "0 0 50%",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          cursor: "default",
          opacity: isOpen ? 1 : 0,
          transition: isOpen
            ? `opacity ${dur(150)} ${EASE}`
            : `opacity ${dur(150)} ${EASE} ${reducedMotion ? "0ms" : `${STAGGER_CLOSE_DONE_MS}ms`}`,
        }}
      />

      {/* Right half — vault panel */}
      <div
        ref={panelRef}
        style={{
          position: "relative",
          flex: "0 0 50%",
          height: "100%",
          display: "flex",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          borderLeft: "1px solid rgba(255, 255, 255, 0.12)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          // On close: panel slides out only after the reverse stagger completes.
          transition: isOpen
            ? `transform ${dur(150)} ${EASE}`
            : `transform ${dur(150)} ${EASE} ${reducedMotion ? "0ms" : `${STAGGER_CLOSE_DONE_MS}ms`}`,
          overflow: "hidden",
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Intelligence Vault"
          className="opacity-60 hover:opacity-100"
          style={{
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 10,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text)",
            padding: 8,
            transition: `opacity 100ms ${EASE}`,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        {/* ── List zone ──────────────────────────────────────────────────── */}
        {/* height: 100% is required: the parent panel is display:flex (row),
            and Chrome collapses overflow:auto children to content height instead
            of stretching them — breaking justify-content:space-between.
            Cascade: outer dialog (inset:0) → panel (height:100%) → list zone (height:100%). */}
        <div
          style={{
            flex: "0 0 55%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            padding: "4dvh 32px",
            overflowY: "auto",
            boxSizing: "border-box",
          }}
        >

          {/* ── Group: DEPENDENCIES — flex:1 section, content centered vertically */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* stagger 0: label */}
            <div style={staggerWrap(0)}>
              <div style={CATEGORY_LABEL}>DEPENDENCIES</div>
            </div>

            {/* Connector — marginTop +4px extra gap under label */}
            <div style={{ position: "relative", paddingLeft: "18px", marginTop: "10px" }}>
              {/* Base line */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0, top: 0, bottom: 0,
                  width: "2px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              />
              {/* Sliding indicator */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: indicatorTop,
                  width: "2px",
                  height: indicatorHeight,
                  backgroundColor: "rgba(255,255,255,0.85)",
                  transition: reducedMotion
                    ? "none"
                    : `top ${dur(150)} ${EASE}, height ${dur(150)} ${EASE}`,
                }}
              />

              {/* stagger 1–4: platform buttons
                  Wrapper uses opacity-ONLY so Chrome doesn't treat it as
                  offsetParent — btn.offsetTop stays correct against connector.
                  translateY lives on an inner span. */}
              {PLATFORMS.map((item, idx) => (
                <div key={item.id} style={platformWrap(idx + 1)}>
                  <button
                    ref={(el) => { platformRefs.current[idx] = el; }}
                    type="button"
                    onMouseEnter={() => setSelectedId(item.id)}
                    onFocus={() => setSelectedId(item.id)}
                    aria-label={item.name}
                    style={{
                      display: "block",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px 0",
                      width: "100%",
                      textAlign: "left",
                      // Selection opacity logic:
                      // • isOpen=false (closing): keep selection opacity so the platform
                      //   fades out at full/dim rather than snapping before the wrapper
                      //   stagger closes it. (!isOpen short-circuits to selection.)
                      // • isOpen=true, hasStaggered=false (open stagger in progress):
                      //   all buttons neutral at 0.22 — prevents GT-AERO from starting
                      //   at opacity:1 before a transition has run (GT-AERO bug fix).
                      // • isOpen=true, hasStaggered=true (steady state): selection opacity.
                      //   GT-AERO animates 0.22→1 cleanly, matching any other platform.
                      // • reducedMotion: always apply selection immediately.
                      opacity: (!isOpen || hasStaggered || reducedMotion)
                        ? (selectedId === item.id ? 1 : 0.22)
                        : 0.22,
                      transition: `opacity ${dur(80)} ${EASE}`,
                    }}
                  >
                    <span style={platformInner(idx + 1)}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.35)",
                          letterSpacing: "0.06em",
                          userSelect: "none",
                          flexShrink: 0,
                          paddingBottom: "2px",
                        }}
                      >
                        {item.num}
                      </span>
                      <span style={PLATFORM_TEXT}>{item.name}</span>
                    </span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ── Group: EXPLORE — flex:1 section, separator at boundary, content centered */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* stagger 5: separator marks the top boundary of this section */}
            <div style={staggerWrap(5)}>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
            {/* centered content within the remaining section height */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* stagger 6: label */}
            <div style={staggerWrap(6)}>
              <div style={{ ...CATEGORY_LABEL, marginBottom: "8px" }}>EXPLORE</div>
            </div>
            {/* stagger 7–10: page links */}
            <div style={{ paddingLeft: "18px" }}>
              {PAGE_LINKS.map((item, idx) => (
                <div key={item.id} style={staggerWrap(idx + 7)}>
                  <button
                    type="button"
                    aria-label={item.name}
                    onMouseEnter={() => setHoveredLinkId(item.id)}
                    onMouseLeave={() => setHoveredLinkId(null)}
                    onFocus={() => setHoveredLinkId(item.id)}
                    onBlur={() => setHoveredLinkId(null)}
                    className="opacity-60 hover:opacity-100 focus-visible:opacity-100"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 0",
                      width: "100%",
                      textAlign: "left",
                      transition: `opacity ${dur(80)} ${EASE}`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: 2,
                        height: 12,
                        backgroundColor: "rgba(255,255,255,0.75)",
                        opacity: hoveredLinkId === item.id ? 1 : 0,
                        transition: `opacity ${dur(80)} ${EASE}`,
                      }}
                    />
                    <span style={LINK_TEXT}>{item.name}</span>
                  </button>
                </div>
              ))}
            </div>
            </div>{/* end centering inner div */}
          </div>{/* end EXPLORE section */}

          {/* ── Group: RESOURCES — flex:1 section, separator at boundary, content centered */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            {/* stagger 11: separator marks the top boundary of this section */}
            <div style={staggerWrap(11)}>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
            {/* centered content within the remaining section height */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {/* stagger 12: label */}
            <div style={staggerWrap(12)}>
              <div style={{ ...CATEGORY_LABEL, marginBottom: "8px" }}>RESOURCES</div>
            </div>
            {/* stagger 13–16: utility links */}
            <div style={{ paddingLeft: "18px" }}>
              {UTILITY_LINKS.map((item, idx) => (
                <div key={item.id} style={staggerWrap(idx + 13)}>
                  <button
                    type="button"
                    aria-label={item.name}
                    onMouseEnter={() => setHoveredLinkId(item.id)}
                    onMouseLeave={() => setHoveredLinkId(null)}
                    onFocus={() => setHoveredLinkId(item.id)}
                    onBlur={() => setHoveredLinkId(null)}
                    className="opacity-60 hover:opacity-100 focus-visible:opacity-100"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px 0",
                      width: "100%",
                      textAlign: "left",
                      transition: `opacity ${dur(80)} ${EASE}`,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        width: 2,
                        height: 12,
                        backgroundColor: "rgba(255,255,255,0.75)",
                        opacity: hoveredLinkId === item.id ? 1 : 0,
                        transition: `opacity ${dur(80)} ${EASE}`,
                      }}
                    />
                    <span style={LINK_TEXT}>{item.name}</span>
                  </button>
                </div>
              ))}
            </div>
            </div>{/* end centering inner div */}
          </div>{/* end RESOURCES section */}

        </div>

        {/* ── Reveal zone ────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "80px 32px 80px 24px",
            borderLeft: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              opacity: activeItem ? 1 : 0,
              transition: `opacity ${dur(80)} ${EASE}`,
            }}
          >
            {activeItem && (
              <>
                {/* Isometric placeholder */}
                <div style={{ height: "120px", marginBottom: "24px" }} aria-hidden="true" />

                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.3)",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "12px",
                  }}
                >
                  PLATFORM {activeItem.num}
                </div>

                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.65,
                    margin: "0 0 24px 0",
                  }}
                >
                  {activeItem.desc}
                </p>

                <dl
                  style={{
                    margin: 0,
                    padding: 0,
                    display: "grid",
                    gridTemplateColumns: "max-content 1fr",
                    gap: "6px 16px",
                  }}
                >
                  {(["PATENTS", "JURISDICTIONS", "STATUS"] as const).map((label) => (
                    <Fragment key={label}>
                      <dt
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.3)",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}
                      >
                        {label}
                      </dt>
                      <dd
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.4)",
                          margin: 0,
                        }}
                      >
                        —
                      </dd>
                    </Fragment>
                  ))}
                </dl>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
