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
const PLATFORM_STAGGER_DONE_MS =
  STAGGER_BASE_MS + PLATFORMS.length * STAGGER_STEP_MS + STAGGER_DUR_MS + 30;

// Close-stagger constants — reverse of the open stagger.
const STAGGER_CLOSE_DUR_MS = 60;
const STAGGER_ITEM_COUNT =
  1 + PLATFORMS.length + 1 + 1 + PAGE_LINKS.length + 1 + 1 + UTILITY_LINKS.length;
const STAGGER_CLOSE_DONE_MS =
  (STAGGER_ITEM_COUNT - 1) * STAGGER_STEP_MS + STAGGER_CLOSE_DUR_MS;

const CATEGORY_LABEL: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: "10px",
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.35)",
};

// clamp: 22px floor on mobile so "GT-AERO" (7 chars) fits inside a 375px panel.
const PLATFORM_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(22px, 5.5vw, 36px)",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#ffffff",
  lineHeight: 1.1,
};

// clamp: subtle floor ensures legibility even on 320px viewports.
const LINK_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "clamp(14px, 4vw, 17px)",
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
  // true when viewport width < 768px — drives the entire mobile layout branch.
  const [isMobile, setIsMobile]               = useState(false);

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

  // ── mobile breakpoint (<768px) ────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches);
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
  // delayed transition is removed. Without this, the 120ms delay persists
  // and interferes with the button's 80ms selection opacity (GT-AERO bug).
  useEffect(() => {
    if (!isOpen) {
      setHasStaggered(false);
      return;
    }
    const t = setTimeout(() => setHasStaggered(true), PLATFORM_STAGGER_DONE_MS);
    return () => clearTimeout(t);
  }, [isOpen]);

  // ── platform indicator measurement ───────────────────────────────────────
  // Wrapper divs use opacity-only (no transform) so Chrome doesn't treat
  // them as offsetParent — btn.offsetTop stays correct against connector.
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

  const closeDelay = (idx: number) =>
    `${(STAGGER_ITEM_COUNT - 1 - idx) * STAGGER_STEP_MS}ms`;

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

  // Platform wrapper: opacity-ONLY (no transform) — preserves btn.offsetTop.
  // Returns {} after stagger completes so button's own opacity transition takes over.
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

  // translateY lives on the inner span — outside the offsetParent chain.
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
      {/* Left half — desktop only (backdrop + click-to-close).
          Hidden on mobile: panel takes 100% width, X button closes instead. */}
      {!isMobile && (
        <div
          aria-hidden="true"
          onClick={onClose}
          style={{
            flex: "0 0 50%",
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            cursor: "pointer",
            opacity: isOpen ? 1 : 0,
            transition: isOpen
              ? `opacity ${dur(150)} ${EASE}`
              : `opacity ${dur(150)} ${EASE} ${reducedMotion ? "0ms" : `${STAGGER_CLOSE_DONE_MS}ms`}`,
          }}
        />
      )}

      {/* ── Vault panel ───────────────────────────────────────────────────── */}
      {/* Desktop: right 50%, side-by-side (list | reveal zone).
          Mobile:  full 100%, stacked vertically (list → reveal zone).
          The panel itself scrolls on mobile; on desktop the list zone scrolls. */}
      <div
        ref={panelRef}
        style={{
          position: "relative",
          flex: isMobile ? "0 0 100%" : "0 0 50%",
          height: "100%",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          backdropFilter: "blur(12px)",
          borderLeft: isMobile ? "none" : "1px solid rgba(255, 255, 255, 0.12)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: isOpen
            ? `transform ${dur(150)} ${EASE}`
            : `transform ${dur(150)} ${EASE} ${reducedMotion ? "0ms" : `${STAGGER_CLOSE_DONE_MS}ms`}`,
          // Mobile: panel scrolls vertically. Desktop: list zone handles overflow.
          overflowY: isMobile ? "auto" : "hidden",
          overflowX: "hidden",
        }}
      >
        {/* Close button — same position on both mobile and desktop */}
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

        {/* ── List zone ──────────────────────────────────────────────────────
            Desktop: fixed 55% column, height 100%, internal overflow-y scroll.
            Mobile:  natural (auto) height in column flow; parent panel scrolls.
            The height:100% + overflowY:auto on desktop forces Chrome to honour
            justify-content on the flex column (cascade: dialog→panel→list zone). */}
        <div
          style={{
            flex: isMobile ? "none" : "0 0 55%",
            height: isMobile ? "auto" : "100%",
            display: "flex",
            flexDirection: "column",
            padding: isMobile ? "clamp(24px, 5dvh, 48px) 20px" : "4dvh 32px",
            overflowY: isMobile ? "visible" : "auto",
            boxSizing: "border-box",
          }}
        >

          {/* ── Group: DEPENDENCIES ──────────────────────────────────────── */}
          <div style={{
            flex: isMobile ? "none" : 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: isMobile ? "flex-start" : "center",
          }}>
            <div style={staggerWrap(0)}>
              <div style={CATEGORY_LABEL}>DEPENDENCIES</div>
            </div>

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

              {/* Platform buttons — stagger 1–4.
                  Wrapper: opacity-only (no transform) so Chrome doesn't change
                  offsetParent, keeping btn.offsetTop correct for the indicator.
                  onClick added for reliable tap-to-select on touch devices. */}
              {PLATFORMS.map((item, idx) => (
                <div key={item.id} style={platformWrap(idx + 1)}>
                  <button
                    ref={(el) => { platformRefs.current[idx] = el; }}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
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
                      // Selection opacity:
                      // • closing (!isOpen): use selection so items fade at correct weight.
                      // • open stagger in progress (!hasStaggered): all at 0.22 (GT-AERO bug fix).
                      // • steady state (hasStaggered): selection opacity — GT-AERO 0.22→1 cleanly.
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

          {/* ── Group: EXPLORE ───────────────────────────────────────────── */}
          <div style={{
            flex: isMobile ? "none" : 1,
            display: "flex",
            flexDirection: "column",
            marginTop: isMobile ? "24px" : undefined,
          }}>
            {/* stagger 5: separator */}
            <div style={staggerWrap(5)}>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
            <div style={{
              flex: isMobile ? "none" : 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: isMobile ? "flex-start" : "center",
            }}>
              {/* stagger 6: label */}
              <div style={staggerWrap(6)}>
                <div style={{ ...CATEGORY_LABEL, marginBottom: "8px", marginTop: isMobile ? "16px" : undefined }}>
                  EXPLORE
                </div>
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
            </div>
          </div>

          {/* ── Group: RESOURCES ─────────────────────────────────────────── */}
          <div style={{
            flex: isMobile ? "none" : 1,
            display: "flex",
            flexDirection: "column",
            marginTop: isMobile ? "24px" : undefined,
          }}>
            {/* stagger 11: separator */}
            <div style={staggerWrap(11)}>
              <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)" }} />
            </div>
            <div style={{
              flex: isMobile ? "none" : 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: isMobile ? "flex-start" : "center",
            }}>
              {/* stagger 12: label */}
              <div style={staggerWrap(12)}>
                <div style={{ ...CATEGORY_LABEL, marginBottom: "8px", marginTop: isMobile ? "16px" : undefined }}>
                  RESOURCES
                </div>
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
            </div>
          </div>

          {/* Bottom clearance so last link isn't flush against reveal zone border */}
          {isMobile && <div aria-hidden="true" style={{ height: "8px" }} />}

        </div>

        {/* ── Reveal zone ────────────────────────────────────────────────────
            Desktop: right column inside panel (flex:1, borderLeft).
            Mobile:  stacked below the list, full width, borderTop separator.
            Isometric placeholder reduced on mobile (120px → 40px). */}
        <div
          style={{
            flex: isMobile ? "none" : 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: isMobile ? "flex-start" : "center",
            padding: isMobile ? "24px 20px 48px" : "80px 32px 80px 24px",
            borderLeft: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
            borderTop: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none",
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
                <div style={{ height: isMobile ? "40px" : "120px", marginBottom: "24px" }} aria-hidden="true" />

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
