# sections/software.md — Statement Section (Scroll Reveal)

> Brief para construir la sección de declaración (el texto grande que sigue al Hero).
> Antes de codear: leer `DESIGN_SYSTEM.md` y `CLAUDE.md`. Stack: Next.js (App Router).
> Ancla de efecto: la sección de texto de Palantir (texto que se ilumina al hacer scroll),
> **traducida al dark mode** del proyecto (texto claro sobre void negro, NO fondo blanco).

## Propósito
Después del Hero, esta sección hace una **declaración clínica** de qué es Groasis, sin
léxico de marketing. El texto se revela conforme el usuario hace scroll, palabra por
palabra / segmento por segmento, pasando de atenuado a pleno — como un sistema que
"enfoca" la información. Demuestra, no persuade.

## Contenido (texto definitivo)
Un solo bloque de texto grande, centrado:

> **Frontier hardware built on sixty granted patents. Propellantless propulsion, light-based cellular reengineering, next-generation communication infrastructure.**

- Nota: "sixty granted patents" es una afirmación verificable — debe coincidir con el dato real (patentes **otorgadas**, no en trámite).
- Sin subtexto ni botones en el MVP. El texto es la sección.

## Layout
- Sección a altura completa o casi (`min-height: 100dvh` o ~80-90dvh), fondo **Base Void `#000000`** (sin video, sin imagen — esta sección es void puro, contraste deliberado con el Hero).
- Texto centrado horizontal y verticalmente, con buen margen lateral (no full-bleed; el texto necesita aire para leerse). Ancho máximo de línea para que no se estire demasiado en pantallas anchas.
- Tipografía: **Space Grotesk** (Primary Display), peso medio. Tamaño grande pero legible (que ocupe presencia sin desbordar). `letter-spacing: -0.02em`.
- Opcional, muy discreto: una etiqueta de sección en mono arriba o abajo (ej. "OUR SOFTWARE" / "STATEMENT") en `--color-text-muted`, estilo rótulo, como en el menú. Decidir si suma o satura.

## El efecto: Scroll Reveal (iluminación progresiva)
Réplica del efecto Palantir, en dark mode:
- En reposo, el texto está **atenuado** (gris tenue, ej. opacidad ~25-30% o un gris oscuro).
- Conforme el usuario hace scroll a través de la sección, el texto se **revela de izquierda a derecha / de inicio a fin**, segmento por segmento (palabra por palabra o por grupos de palabras), pasando de atenuado a **blanco pleno** (`--color-text` / `#FFFFFF`).
- El progreso del revelado está **atado a la posición de scroll** (scroll-linked): a más scroll dentro de la sección, más texto iluminado. Si el usuario sube, se vuelve a atenuar (reversible).
- Al terminar la sección, todo el texto está en blanco pleno.

### Implementación sugerida (Next.js)
- Dividir el texto en palabras (o segmentos) y animar la opacidad/color de cada una según el progreso de scroll de la sección.
- Usar **scroll-driven animations** nativas de CSS (`animation-timeline: view()`) si el soporte es suficiente, o un enfoque con `IntersectionObserver` + cálculo de progreso de scroll. Evitar librerías pesadas si se puede; mantener simple.
- El cambio de cada palabra es **opacidad/color**, nada de movimiento espacial grande ni escalado.

## Timings y curva (según DESIGN_SYSTEM.md)
- La transición de cada palabra (atenuado → pleno) es **nítida**: ~80-120ms con `cubic-bezier(0,0,0.2,1)`. **Sin rebote, sin elasticidad.**
- El revelado sigue el scroll de forma directa y lineal — no "flota" ni rebota. Debe sentirse como un instrumento que enfoca, no como una animación blanda.
- **`prefers-reduced-motion`:** con la preferencia activa, el texto se muestra directamente en blanco pleno, sin efecto de revelado por scroll (estático, legible).

## Estándares (CLAUDE.md / DESIGN_SYSTEM.md)
- Dark mode: texto claro sobre void negro. **NUNCA fondo blanco** (eso rompería el sistema).
- Cero `box-shadow`. Si hubiera contenedores, esquinas a 0px.
- Voz: el texto ya es clínico y verificable. No añadir copy de marketing.

## Lo que NO va (MVP)
- Sin fondo blanco, sin imágenes, sin video en esta sección (void puro).
- Sin botones ni CTAs.
- Sin animaciones cinemáticas con física blanda (spring/bounce).

## Criterio de "listo"
- Texto centrado, Space Grotesk, sobre void negro.
- En reposo atenuado; al hacer scroll se ilumina segmento por segmento hasta blanco pleno; reversible al subir.
- Transiciones nítidas (~80-120ms, ease-out, sin rebote).
- Funciona con `prefers-reduced-motion` (texto pleno estático).
- Legible y con presencia en desktop; verificar que no desborde en pantallas chicas.

## Lente de referencia
Patrón base: la sección de texto con iluminación-por-scroll de Palantir. Lo que tomamos:
el revelado progresivo atado al scroll. Lo que descartamos: su fondo blanco / texto oscuro
(invertido a dark mode), y cualquier suavidad excesiva (lo hacemos nítido, grado HUD).
Si el scroll-linked se siente complejo o mareante en un MVP, la alternativa de respaldo es
un revelado **una sola vez** al entrar la sección en viewport (los segmentos se iluminan en
secuencia rápida al aparecer), sin atar al scroll. Construir, ver, decidir.
