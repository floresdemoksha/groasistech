"use client";

export function Header() {
  return (
    <header
      className="fixed top-3 left-4 right-4 z-50 border border-[var(--color-border)] backdrop-blur-[10px] overflow-hidden"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        borderRadius: "10px",
      }}
    >
      <div className="flex items-center justify-between px-[var(--space-4)] py-[var(--space-2)]">
        {/* Logo / Wordmark */}
        <div className="text-[var(--color-text)] font-semibold tracking-tight text-base">
          GROASIS-TECH
        </div>

        {/* Intelligence Vault Trigger */}
        <button
          type="button"
          className="group flex items-center justify-center w-10 h-10 text-[var(--color-text)]"
          style={{
            transitionDuration: "100ms",
            transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          }}
          aria-label="Open Intelligence Vault"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <line
              x1="3" y1="7" x2="21" y2="7"
              className="transition-transform group-hover:-translate-y-0.5"
              style={{ transitionDuration: "100ms", transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" }}
            />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line
              x1="3" y1="17" x2="21" y2="17"
              className="transition-transform group-hover:translate-y-0.5"
              style={{ transitionDuration: "100ms", transitionTimingFunction: "cubic-bezier(0, 0, 0.2, 1)" }}
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
