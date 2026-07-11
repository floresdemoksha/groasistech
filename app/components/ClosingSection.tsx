import Link from "next/link";
import type { ReactNode } from "react";

// ── Tokens de la sección clara (inversión del sistema dark) ──────────────────
const BG          = "#F4F4F4";
const TEXT        = "#0B0E11";
const MUTED       = "rgba(11,14,17,0.45)";
const BORDER      = "rgba(0,0,0,0.12)";
const PAD_H = "clamp(24px, 6vw, 80px)";
const PAD_V       = "clamp(56px, 7dvh, 96px)";

// ── Botón con esquinas tipo corchete ─────────────────────────────────────────
function BracketButton({
  children,
  href = "#",
}: {
  children: ReactNode;
  href?: string;
}) {
  const corner = "1px solid rgba(0,0,0,0.3)";
  const sharedCorner = {
    position: "absolute" as const,
    width: "8px",
    height: "8px",
    pointerEvents: "none" as const,
  };

  return (
    <Link
      href={href}
      className="hover:bg-black/[0.05] transition-colors duration-[80ms] ease-[cubic-bezier(0,0,0.2,1)]"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        padding: "10px 20px",
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 400,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        color: TEXT,
        textDecoration: "none",
        whiteSpace: "nowrap",
      }}
    >
      <span aria-hidden="true" style={{ ...sharedCorner, top: 0,    left:  0, borderTop: corner,    borderLeft:   corner }} />
      <span aria-hidden="true" style={{ ...sharedCorner, top: 0,    right: 0, borderTop: corner,    borderRight:  corner }} />
      <span aria-hidden="true" style={{ ...sharedCorner, bottom: 0, left:  0, borderBottom: corner, borderLeft:   corner }} />
      <span aria-hidden="true" style={{ ...sharedCorner, bottom: 0, right: 0, borderBottom: corner, borderRight:  corner }} />
      {children}
    </Link>
  );
}

// ── Navegación (mirrors Intelligence Vault) ───────────────────────────────────
const NAV: Record<string, { name: string; href: string }[]> = {
  PLATFORMS: [
    { name: "GT-AERO", href: "/platforms/gt-aero" },
    { name: "PHOTON",  href: "/platforms/photon"  },
    { name: "TELECO",  href: "/platforms/teleco"  },
    { name: "OTHER",   href: "#"                  },
  ],
  COMPANY: [
    { name: "Who We Are",        href: "#" },
    { name: "Technical Archive", href: "#" },
    { name: "Deployments",       href: "#" },
    { name: "Contact",           href: "#" },
  ],
  LEGAL: [
    { name: "News / Press",       href: "#" },
    { name: "Investor Relations", href: "#" },
    { name: "Privacy",            href: "#" },
    { name: "Legal / Terms",      href: "#" },
  ],
};

// ── Componente principal ──────────────────────────────────────────────────────
export function ClosingSection() {
  return (
    <section
      data-header-theme="light"
      style={{ backgroundColor: BG, color: TEXT }}
    >
      {/* ════════════════════════════════════════════════════════
          BLOQUE 1 — CTA (altura completa del viewport)
          Contenido anclado al borde inferior del viewport-height,
          con todo el espacio blanco encima respirando.
          ════════════════════════════════════════════════════════ */}
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: `${PAD_V} ${PAD_H}`,
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4.5vw, 72px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: TEXT,
              margin: 0,
              maxWidth: "580px",
            }}
          >
            Deploy sovereign infrastructure.
          </h2>

          <div style={{ flexShrink: 0 }}>
            <BracketButton href="#">Request Technical Briefing</BracketButton>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          BLOQUE 2 — FOOTER
          ════════════════════════════════════════════════════════ */}
      <div style={{ padding: `${PAD_V} ${PAD_H}` }}>
        <div
          className="grid grid-cols-1 md:grid-cols-[5fr_7fr]"
          style={{ gap: "clamp(40px, 5dvh, 64px)" }}
        >
          {/* ── Izquierda: wordmark + misión + botones ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                color: TEXT,
              }}
            >
              GROASIS-TECH
            </div>

            {/* PLACEHOLDER — reemplazar con misión real antes de publicar */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(13px, 1.05vw, 15px)",
                fontWeight: 400,
                lineHeight: 1.6,
                color: MUTED,
                margin: 0,
                maxWidth: "300px",
                letterSpacing: "-0.01em",
              }}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Infraestructura
              soberana diseñada para operar donde los sistemas convencionales no alcanzan.
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <BracketButton href="#">Contact Us</BracketButton>
              <BracketButton href="#">Careers</BracketButton>
            </div>
          </div>

          {/* ── Derecha: tres columnas de navegación ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(16px, 2.5vw, 40px)",
            }}
          >
            {Object.entries(NAV).map(([label, links]) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    fontWeight: 400,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: MUTED,
                  }}
                >
                  {label}
                </span>

                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-[rgba(11,14,17,0.45)] hover:text-[#0B0E11] transition-colors duration-[80ms] ease-[cubic-bezier(0,0,0.2,1)]"
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: "clamp(12px, 0.95vw, 14px)",
                          fontWeight: 400,
                          textDecoration: "none",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            marginTop: "clamp(40px, 5dvh, 64px)",
            paddingTop: "clamp(20px, 2.5dvh, 32px)",
            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            © 2026 GROASIS-TECH. All rights reserved.
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          BLOQUE 3 — WORDMARK MONUMENTAL
          22vw font-size, contenedor height:12vw con overflow:hidden
          → clip del ~30% inferior de las letras. Estático.
          El scroll pesado se retoma en un paso aparte si se decide.
          ════════════════════════════════════════════════════════ */}
      <div
        aria-hidden="true"
        style={{ overflow: "hidden", height: "12vw" }}
      >
        <p
          style={{
            fontFamily:    "var(--font-display)",
            fontSize:      "22vw",
            fontWeight:    600,
            letterSpacing: "-0.03em",
            lineHeight:    1,
            color:         "#D4D4D4",
            margin:        0,
            paddingLeft:   PAD_H,
            whiteSpace:    "nowrap",
            userSelect:    "none",
          }}
        >
          GROASIS
        </p>
      </div>
    </section>
  );
}
