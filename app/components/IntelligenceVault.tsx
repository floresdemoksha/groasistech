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

  // For non-platform items: full opacity + translateY on the wrapper div.
  const staggerWrap = (idx: number): React.CSSProperties => {
    if (reducedMotion) return {};
    const d = `${idx * 40 + 80}ms`;
    return {
      opacity: isOpen ? 1 : 0,
      transform: isOpen ? "translateY(0)" : "translateY(6px)",
      transition: isOpen
        ? `opacity 120ms ${EASE} ${d}, transform 120ms ${EASE} ${d}`
        : `opacity 60ms ${EASE}, transform 60ms ${EASE}`,
    };
  };

  // For platform items: ONLY opacity on the wrapper div.
  // Applying transform here would make Chrome treat the div as an offsetParent,
  // breaking btn.offsetTop measurement. The translateY goes on an inner span instead.
  const platformWrap = (idx: number): React.CSSProperties => {
    if (reducedMotion) return {};
    const d = `${idx * 40 + 80}ms`;
    return {
      opacity: isOpen ? 1 : 0,
      transition: isOpen
        ? `opacity 120ms ${EASE} ${d}`
        : `opacity 60ms ${EASE}`,
    };
  };

  // translateY for the inner span inside each platform button.
  const platformInner = (idx: number): React.CSSProperties => {
    if (reducedMotion) return { display: "flex", alignItems: "baseline", gap: "10px" };
    const d = `${idx * 40 + 80}ms`;
    return {
      display: "flex",
      alignItems: "baseline",
      gap: "10px",
      transform: isOpen ? "translateY(0)" : "translateY(6px)",
      transition: isOpen
        ? `transform 120ms ${EASE} ${d}`
        : `transform 60ms ${EASE}`,
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
        opacity: isOpen ? 1 : 0,
        transition: `opacity ${dur(150)} ${EASE}`,
      }}
    >
      {/* Left half — click closes */}
      <div
        aria-hidden="true"
        onClick={onClose}
        style={{
          flex: "0 0 50%",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          cursor: "default",
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
          transition: `transform ${dur(150)} ${EASE}`,
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
        <div
          style={{
            flex: "0 0 55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "40px 32px",
            overflowY: "auto",
          }}
        >
          {/* Group 1 — DEPENDENCIES + platforms */}
          <div>
            {/* stagger 0: DEPENDENCIES label */}
            <div style={staggerWrap(0)}>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "10px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.35)",
                }}
              >
                DEPENDENCIES
              </div>
            </div>

            {/* Connector with vertical sliding indicator */}
            <div
              style={{
                position: "relative",
                paddingLeft: "18px",
                marginTop: "6px",
              }}
            >
              {/* Base line */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "2px",
                  backgroundColor: "rgba(255,255,255,0.12)",
                }}
              />
              {/* Sliding indicator — moves to the active platform */}
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
                  Wrapper has opacity-ONLY (no transform) so Chrome doesn't
                  treat it as offsetParent — btn.offsetTop stays correct.
                  The translateY lives on an inner span inside the button. */}
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
                      opacity: selectedId === item.id ? 1 : 0.22,
                      transition: `opacity ${dur(80)} ${EASE}`,
                    }}
                  >
                    {/* inner span carries the translateY — doesn't affect offsetParent */}
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

          {/* stagger 5: separator */}
          <div style={staggerWrap(5)}>
            <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "14px 0 0" }} />
          </div>

          {/* stagger 6: EXPLORE label — same style as DEPENDENCIES */}
          <div style={staggerWrap(6)}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginTop: "8px",
              }}
            >
              EXPLORE
            </div>
          </div>

          {/* Group 2 — page links, stagger 7–10, indented to match platforms */}
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

          {/* stagger 11: separator */}
          <div style={staggerWrap(11)}>
            <div style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.1)", margin: "14px 0 0" }} />
          </div>

          {/* stagger 12: RESOURCES label */}
          <div style={staggerWrap(12)}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "10px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.35)",
                marginTop: "8px",
              }}
            >
              RESOURCES
            </div>
          </div>

          {/* Group 3 — utility links, stagger 13–16, indented to match platforms */}
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
                  padding: "7px 0",
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
