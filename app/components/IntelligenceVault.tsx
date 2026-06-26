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
  { id: "who-we-are",       name: "Who We Are",       desc: "The research arm behind 60+ patents across three sovereign domains." },
  { id: "technical-archive", name: "Technical Archive", desc: "Patent registry. Analytical isometry." },
  { id: "deployments",      name: "Deployments",      desc: "Validation records. Field data." },
  { id: "contact",          name: "Contact",          desc: "Get in touch with the Groasis Tech team." },
];

const EASE = "cubic-bezier(0, 0, 0.2, 1)";

const PLATFORM_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "40px",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  color: "#ffffff",
  lineHeight: 1.1,
};

const PAGE_LINK_TEXT: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontSize: "20px",
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

  const panelRef     = useRef<HTMLDivElement>(null);
  const platformRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const wasOpenRef   = useRef(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const h = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  // Scroll lock + reset selection on open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (isOpen) setSelectedId("gt-aero");
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Esc key
  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  // Focus management
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

  // Measure indicator against selected platform button
  useEffect(() => {
    const idx = PLATFORMS.findIndex((p) => p.id === selectedId);
    const btn = platformRefs.current[idx];
    if (!btn) return;
    setIndicatorTop(btn.offsetTop);
    setIndicatorHeight(btn.offsetHeight);
  }, [selectedId, isOpen]);

  // Focus trap
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
      {/* Left half — dimmed + blurred, click closes */}
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
        {/* Close button — aligned with DEPENDENCIES label (top: 64px) */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Intelligence Vault"
          className="opacity-60 hover:opacity-100"
          style={{
            position: "absolute",
            top: 64,
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
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <line x1="4" y1="4" x2="16" y2="16" />
            <line x1="16" y1="4" x2="4" y2="16" />
          </svg>
        </button>

        {/* List zone */}
        <div
          style={{
            flex: "0 0 55%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            padding: "64px 40px",
          }}
        >
          {/* Group 1 — DEPENDENCIES + platforms */}
          <div>
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

            {/* Connector with sliding indicator */}
            <div
              style={{
                position: "relative",
                paddingLeft: "18px",
                marginTop: "10px",
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

              {PLATFORMS.map((item, idx) => (
                <button
                  key={item.id}
                  ref={(el) => { platformRefs.current[idx] = el; }}
                  type="button"
                  onMouseEnter={() => setSelectedId(item.id)}
                  onFocus={() => setSelectedId(item.id)}
                  aria-label={item.name}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "10px 0",
                    width: "100%",
                    textAlign: "left",
                    opacity: selectedId === item.id ? 1 : 0.22,
                    transition: `opacity ${dur(80)} ${EASE}`,
                  }}
                >
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
                </button>
              ))}
            </div>
          </div>

          {/* Group 2 — page links */}
          <div>
            <div
              style={{
                height: "1px",
                backgroundColor: "rgba(255,255,255,0.1)",
                marginBottom: "16px",
              }}
            />

            {PAGE_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-label={item.name}
                className="opacity-60 hover:opacity-100 focus-visible:opacity-100"
                style={{
                  display: "block",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "7px 0",
                  width: "100%",
                  textAlign: "left",
                  transition: `opacity ${dur(80)} ${EASE}`,
                }}
              >
                <span style={PAGE_LINK_TEXT}>{item.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reveal zone */}
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
                {/* Isometric placeholder — reserved space for future illustration */}
                <div style={{ height: "120px", marginBottom: "24px" }} aria-hidden="true" />

                {/* Platform label */}
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

                {/* Description */}
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

                {/* HUD metadata */}
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
