# sections/closing.md — Closing Section (CTA + Footer + Wordmark)

> Brief para la sección final del sitio: cierre con CTA, footer y wordmark monumental.
> Antes de codear: leer `DESIGN_SYSTEM.md` y `CLAUDE.md`. Stack: Next.js (App Router).
> Ancla de referencia: la sección de cierre de Shield AI (CTA arriba → footer de columnas →
> wordmark gigante recortado abajo, revelado con scroll pesado).
> **DIFERENCIA CLAVE: esta sección es en BLANCO / modo claro** — es la PRIMERA sección clara
> del sitio (todo lo demás es dark mode). Contraste deliberado: el sitio "aterriza" en claro.

## Propósito
Cerrar el sitio con autoridad: una llamada a la acción sobria, un footer con toda la
navegación, y un wordmark monumental "GROASIS" como firma final. El cambio a fondo blanco
marca el final del recorrido (de void oscuro a documento claro).

## Tema / modo
- **Fondo claro** (blanco o casi-blanco, ej. `#EAEAEA` / `#F4F4F4` — un blanco cálido/neutro,
  NO blanco puro cegador). Texto oscuro (`#0B0E11` o negro suave).
- Marca esta sección con `data-theme="light"` para que el **header (mix-blend / context-aware)
  reaccione automáticamente** y siga siendo legible sobre el fondo claro. Esta es la primera
  sección que activa el modo claro del header — verificar que el header se vea correcto sobre
  blanco (no invisible, no roto).
- Invierte la lógica de todo el sistema aquí: donde el resto del sitio es texto claro sobre
  oscuro, esta sección es texto oscuro sobre claro. Bordes 1px pasan a `rgba(0,0,0,0.12)`.

## Estructura (3 bloques verticales, de arriba a abajo)

### Bloque 1 — CTA de cierre
- Titular grande a la izquierda (Space Grotesk), texto oscuro. Copy clínico (ver abajo).
- Un botón/acción a la derecha o bajo el titular: **"REQUEST TECHNICAL BRIEFING"** o
  **"CONTACT"** en mono, dentro de un contenedor con esquinas tipo "corchete" (los marcadores
  de esquina ⌐ ¬ que usa Shield AI) o borde 1px recto. Esquinas a 0px (los corchetes son
  decorativos, no border-radius).
- Copy del titular (voz clínica, NO marketing):
  > **Deploy sovereign infrastructure.**
  (Alternativas en la misma voz: "Request a technical briefing." / "Engage with the platform.")
  Evitar lenguaje tipo "unlock the value" — demasiado marketing.

### Bloque 2 — Footer (columnas de navegación)
Estructura tipo Shield AI: logo + misión a la izquierda, columnas de links a la derecha.
- **Izquierda:** wordmark "GROASIS-TECH" (tamaño normal, no el gigante) + una línea de misión.
  - Misión: **[LOREM IPSUM placeholder]** — usar un lorem ipsum de ~1-2 líneas como marcador,
    a reemplazar por la frase de misión real después. Marcar claramente como placeholder.
  - Debajo: dos botones tipo corchete — **"CONTACT US"** y **"CAREERS"** (o "OPEN ROLES").
- **Derecha — tres columnas de links** (rótulos de columna en mono, uppercase, atenuados;
  links debajo). Reusar la navegación ya definida en el Intelligence Vault:
  - **PLATFORMS:** GT-AERO · PHOTON · TELECO · OTHER
  - **COMPANY:** Who We Are · Technical Archive · Deployments · Contact
  - **LEGAL:** News / Press · Investor Relations · Privacy · Legal / Terms
- **Copyright:** línea en mono, atenuada, ej. `© 2026 GROASIS-TECH. ALL RIGHTS RESERVED.`

### Bloque 3 — Wordmark monumental
- La palabra **"GROASIS"** (corta, no "GROASIS-TECH") en tamaño **gigante**, ocupando el ancho,
  recortada por el borde inferior de la pantalla (se sale del viewport abajo, como Shield AI).
- Color: un tono **apenas más oscuro que el fondo** (gris sutil sobre el blanco, NO negro
  pleno) — monumental pero discreto, no gritón.
- Space Grotesk, peso acorde al resto (probar con el weight del sistema).

## Animación / scroll
- **Scroll "pesado" para revelar el wordmark** (como Shield AI): al llegar al final, el scroll
  se siente con peso y el wordmark "GROASIS" se revela emergiendo desde abajo.
- ⚠️ NOTA DE IMPLEMENTACIÓN: el scroll pinning ya causó conflictos antes (rompió el sticky del
  header tras el Statement). **Construir primero el layout completo (CTA + footer + wordmark)
  SIN el scroll pesado**, confirmar que se ve bien y que el header reacciona al tema claro, y
  DESPUÉS agregar el efecto de scroll pesado como capa separada. No arriesgar todo el layout
  por el efecto de scroll.
- Cuando se agregue: verificar que NO rompa el header sticky ni el mix-blend-mode. El header
  debe permanecer visible y legible sobre esta sección clara.
- Timings/curva del sistema; sin rebote. Respetar `prefers-reduced-motion` (sin scroll pesado,
  wordmark visible directo).

## Estándares (CLAUDE.md / DESIGN_SYSTEM.md)
- Esquinas 0px, cero `box-shadow`. Los "corchetes" de esquina en botones son decorativos.
- Mono (JetBrains Mono) para rótulos de columna, copyright, botones. Space Grotesk para el
  titular del CTA y el wordmark.
- Voz clínica. El CTA declara, no persuade.
- Bordes 1px en versión clara: `rgba(0,0,0,0.12)`.

## Criterio de "listo"
- Sección en fondo claro, texto oscuro, marcada `data-theme="light"`.
- Header legible y correcto sobre el fondo claro (verificar el modo claro del header).
- CTA con titular clínico + botón tipo corchete.
- Footer con misión (lorem ipsum placeholder) + 3 columnas de links reusando la nav existente
  + copyright.
- Wordmark "GROASIS" gigante, recortado abajo, en gris sutil sobre el claro.
- Layout construido y verificado ANTES de añadir el scroll pesado.
- Funciona con `prefers-reduced-motion`.

## Lente de referencia
Formato de cierre de Shield AI (CTA → footer columnas → wordmark gigante recortado con scroll
pesado). Lo que tomamos: la estructura de tres bloques y el wordmark monumental discreto.
Lo que adaptamos: es la primera sección CLARA del sitio (Shield AI ya es clara; nosotros
venimos de dark mode, así que aquí el blanco es el giro final). Lo que descartamos: copy de
marketing ("unlock the value" → "deploy sovereign infrastructure").
