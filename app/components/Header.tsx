"use client";

import { useCallback, useRef, useState } from "react";
import { IntelligenceVault } from "./IntelligenceVault";

const EASE = "cubic-bezier(0, 0, 0.2, 1)";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <header
        className="fixed top-3 left-4 right-4 z-50 border border-[var(--color-border)] backdrop-blur-[10px] overflow-hidden"
        style={{
          backgroundColor: "rgba(38, 40, 45, 0.3)",
          borderRadius: "0px",
        }}
      >
        <div className="flex items-center justify-between px-[var(--space-4)] py-[var(--space-2)]">
          {/* Logo / Wordmark */}
          <div className="text-[var(--color-text)] font-semibold tracking-tight text-base">
            GROASIS-TECH
          </div>

          {/* Intelligence Vault Trigger */}
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close Intelligence Vault" : "Open Intelligence Vault"}
            className="group flex items-center justify-center w-10 h-10 text-[var(--color-text)] opacity-70 hover:opacity-100"
            style={{ transition: `opacity 100ms ${EASE}` }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              {/* Hamburger — visible when closed */}
              <g style={{ opacity: isOpen ? 0 : 1, transition: `opacity 100ms ${EASE}` }}>
                <line
                  x1="3" y1="7" x2="21" y2="7"
                  className="transition-transform duration-[100ms] ease-[cubic-bezier(0,0,0.2,1)] group-hover:-translate-y-0.5"
                />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line
                  x1="3" y1="17" x2="21" y2="17"
                  className="transition-transform duration-[100ms] ease-[cubic-bezier(0,0,0.2,1)] group-hover:translate-y-0.5"
                />
              </g>
              {/* X — visible when open */}
              <g style={{ opacity: isOpen ? 1 : 0, transition: `opacity 100ms ${EASE}` }}>
                <line x1="5"  y1="5"  x2="19" y2="19" />
                <line x1="19" y1="5"  x2="5"  y2="19" />
              </g>
            </svg>
          </button>
        </div>
      </header>

      <IntelligenceVault isOpen={isOpen} onClose={close} triggerRef={triggerRef} />
    </>
  );
}
