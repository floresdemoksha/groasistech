# sections/hero.md — Hero Section

> Brief para construir el Hero. Antes de codear: leer `DESIGN_SYSTEM.md` (tokens) y
> las reglas de `CLAUDE.md`. Ancla visual: Palantir (`/references/`), adaptada al void
> y a la paleta de Groasis. Stack: Next.js (App Router).

## Propósito
Primera pantalla = sensación de acceso a una bóveda clasificada. El Hero **fija la escala
del problema** (geopolítica / industrial) y de inmediato empuja al usuario hacia la
topología técnica de abajo. No vende: declara.

## Estructura / layout
- Altura completa de viewport: `100dvh` (no `100vh`, por las barras de móvil).
- Full-bleed, sin márgenes laterales amplios. Gutters ajustados (sensación industrial).
- Composición: header sticky arriba · titular centrado · señal de scroll abajo.
- Todo sobre el video de fondo + scrim.

## Fondo (video cinematográfico)
- Video atmosférico, oscuro y técnico, alineado a los dominios de Groasis (aeroespacial /
  laboratorio / abstracción técnica). **Atmósfera, no catálogo de producto.**
- `<video>` con `autoPlay muted loop playsInline preload="metadata"` y un `poster` (imagen
  estática del primer frame, vía `next/image` o como atributo `poster`).
- Loop corto (referencia Palantir: ~3 s). Formato comprimido (mp4/H.264 + webm si se puede),
  peso vigilado para no penalizar el LCP.
- **`prefers-reduced-motion`:** si está activo, NO reproducir video → mostrar solo el `poster`.
- **PROHIBIDO:** que el video muestre un render fotorrealista del hardware/producto. Eso va
  en isometría de línea clara, en otra sección. Esto es ambiente.

## Scrim (legibilidad)
- Degradado oscuro sobre el video para que el texto se lea. Dos capas:
  - Degradado superior (detrás del header) para anclar la barra.
  - Oscurecimiento/viñeta general centrado en el titular.
- Dentro de la paleta del DESIGN_SYSTEM (negros/void translúcidos). Sin colores nuevos.

## Header (sticky)
- Fijo/sticky, ancho completo, transparente sobre el video (con su degradado de scrim).
- **Izquierda:** logo / wordmark de Groasis Tech.
- **Derecha:** ÚNICAMENTE el disparador del **Intelligence Vault** (ícono de menú).
- **Eliminados a propósito:** botón "Get Started" y el ícono de búsqueda (lupa). No incluirlos.
- Gutters laterales ajustados (~32–48px, ajustar a la escala de espaciado del sistema).
- Al hacer scroll, el header puede ganar un fondo void sutil + **borde inferior de 1px**
  (nunca `box-shadow`). Transición según reglas de movimiento.

## Titular
- Texto centrado, gran escala. Una frase clínica que fija la escala — sin léxico de marketing.
- **Tipografía — decisión a confirmar:** por defecto seguimos el sistema (Primary Display,
  `font-weight: 600`, `letter-spacing: -0.02em`, compacto y denso). El titular del Hero de
  Palantir es más ligero y abierto; si prefieres ese look, cámbialo aquí conscientemente.
- Copy (PLACEHOLDER — refinar con datos reales, voz clínica):
  - Opción A: «Propulsión eléctrica sin propelente. Patentada en 10 jurisdicciones.»
  - Opción B: «Tres dominios. Sesenta patentes. Infraestructura soberana.»
  - (No usar adjetivos de marketing; preferir hechos verificables.)

## Señal de scroll
- Indicador discreto abajo (flecha / línea), estilo HUD. Invita al descubrimiento progresivo.
- Animación mínima y nítida (sin bounce). Respeta `prefers-reduced-motion`.

## Movimiento / timings
- Todo según `DESIGN_SYSTEM.md`: cambios de estado instantáneos (~80 ms), transiciones
  ~120–160 ms, `ease-out` o `linear`. **Sin spring, sin bounce.**

## Notas Next.js
- Componente del Hero como Server Component; el video/interacciones en un Client Component
  acotado (`"use client"`) solo donde haga falta.
- `poster` y assets optimizados; cuidar LCP (el titular o el poster como elemento LCP).
- Accesibilidad: `<h1>` real para el titular; el video es decorativo (`aria-hidden`),
  no transmite información esencial.

## Criterio de "listo" (este Hero es el ancla)
- Se ve sobre el video con texto perfectamente legible (scrim correcto).
- Header sticky con logo + Vault, sin Get Started ni lupa.
- Cero `box-shadow`, esquinas a 0px, bordes 1px, paleta y timings del sistema.
- Funciona con `prefers-reduced-motion` (poster estático).
- Una vez aprobado, queda como referencia de consistencia para el resto del sitio.
