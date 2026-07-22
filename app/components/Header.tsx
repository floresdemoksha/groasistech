"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { IntelligenceVault } from "./IntelligenceVault";

const EASE = "cubic-bezier(0, 0, 0.2, 1)";

const PLATFORM_LINKS = [
  { name: "GT-AERO", href: "/platforms/gt-aero" },
  { name: "PHOTON",  href: "/platforms/photon"  },
  { name: "TELECO",  href: "/platforms/teleco"  },
  { name: "OTHER",   href: "#"                  },
] as const;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          paddingTop: "clamp(44px, 5dvh, 64px)",
          paddingBottom: "clamp(16px, 1.5dvh, 22px)",
          paddingLeft: "clamp(24px, 6vw, 80px)",
          paddingRight: "clamp(24px, 6vw, 80px)",
          // Sin fondo, sin borde, sin blur — solo texto flotando.
          // difference: blanco sobre oscuro = blanco; blanco sobre blanco = negro.
          // Se adapta a cualquier sección, presente o futura, sin lógica de scroll.
          mixBlendMode: "difference",
        }}
      >
        {/* Left — wordmark */}
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "18px",
            fontWeight: 450,
            letterSpacing: "0.06em",
            color: "white",
            textDecoration: "none",
          }}
        >
          GROASIS-TECH
        </Link>

        {/* Center — platform nav (hidden on mobile, visible md+) */}
        <nav
          aria-label="Platform navigation"
          className="hidden md:flex"
          style={{ gap: "clamp(24px, 3.5vw, 48px)" }}
        >
          {PLATFORM_LINKS.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              className="inline-block text-white hover:-translate-y-0.5 transition-transform duration-[120ms] ease-[cubic-bezier(0,0,0.2,1)]"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                fontWeight: 450,
                letterSpacing: "0.08em",
                textDecoration: "none",
              }}
            >
              {name}
            </Link>
          ))}
        </nav>

        {/* Right — COMPANY trigger (opens Intelligence Vault) */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close Intelligence Vault" : "Open Intelligence Vault"}
            className="inline-flex items-center text-white"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              fontWeight: 450,
              letterSpacing: "0.08em",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              gap: "5px",
            }}
          >
            COMPANY
            {/* +/− crossfade — refleja estado del vault */}
            <span
              aria-hidden="true"
              style={{ position: "relative", display: "inline-block", width: "1em", lineHeight: 1 }}
            >
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: isOpen ? 0 : 1,
                  transition: `opacity 120ms ${EASE}`,
                }}
              >
                +
              </span>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  opacity: isOpen ? 1 : 0,
                  transition: `opacity 120ms ${EASE}`,
                }}
              >
                −
              </span>
            </span>
          </button>
        </div>
      </header>

      <IntelligenceVault isOpen={isOpen} onClose={close} triggerRef={triggerRef} />
    </>
  );
}
