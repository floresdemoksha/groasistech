# GROASIS TECH — Guía de Proyecto

> Archivo leído automáticamente por Claude Code al inicio de cada sesión.
> Mantenerlo corto y táctico. El detalle visual vive en `DESIGN_SYSTEM.md`;
> el "porqué" completo en `PHILOSOPHY.md`.

## Qué estamos construyendo
Sitio web de Groasis Tech — laboratorio de innovación de frontera con +60 patentes.
No es un folleto de ventas: es una **instalación de inteligencia digital**. El visitante
(fondos soberanos, agregados, inversores Tier-1) debe sentir que accedió a una bóveda de
información clasificada. Tres plataformas: **GT-AERO** (aeroespacial), **PHOTON** (fotónica),
**TELECO** (telecomunicación).

## Archivos de referencia
- `DESIGN_SYSTEM.md` — fuente única de verdad visual. **Léelo antes de construir cualquier componente visual.**
- `PHILOSOPHY.md` — identidad y tono completos. Consultar solo ante una duda de fondo.
- `sections/<nombre>.md` — brief de la sección en curso (contenido, layout, componentes a usar).
- `/references/` — capturas anotadas. **Palantir = referencia del Hero. Neuralink = subsecciones.**

## Stack
- **Next.js** (App Router). React + CSS (módulos o el sistema de estilos que se defina en DESIGN_SYSTEM.md).
- Imágenes con `next/image`. Respetar `prefers-reduced-motion`.

## Identidad en una línea
No persuadimos: demostramos. Lenguaje clínico, determinista, matemático.

## Reglas de VOZ (duras)
- PROHIBIDO el léxico de marketing: nada de "revolucionario", "innovador", "disruptivo", "de vanguardia", "game-changer".
- Toda afirmación va respaldada por un dato verificable: folio de patente, fórmula, coeficiente o hito de validación. Sin respaldo, no se escribe.
- El legado se presenta como prueba, no como anécdota (track record, validaciones).
- Tono de ficha técnica, jamás de copy publicitario.

## Reglas de DISEÑO (duras — los números exactos están en DESIGN_SYSTEM.md)
- Dark mode nativo. **Por defecto el fondo es un vacío** sobre el que se proyecta luz técnica, no un lienzo decorado.
- **Excepción deliberada de fondo:** el Hero (y divisores atmosféricos puntuales) pueden usar **video cinematográfico** de fondo, siempre con scrim de legibilidad y dentro de la paleta. El resto del sitio mantiene el void.
- **Hardware y patentes: SIEMPRE isometría analítica de línea clara** (estética blueprint). **PROHIBIDO el render fotorrealista del hardware/producto.** (El video del Hero es atmósfera de fondo, no representación de producto — son cosas distintas. No confundir esta excepción con permiso para renders 3D glossy.)
- Bordes de **1px**. **CERO `box-shadow`.** La profundidad se logra por luminosidad del fondo.
- `border-radius: 0` (máximo absoluto 2px). Esquinas afiladas = precisión industrial.
- **Densidad de datos > espacio en blanco** — pero densidad significa información real (telemetría, metadatos, estados de patente), nunca relleno decorativo.
- Fórmulas y whitepapers: **LaTeX puro**.

## Reglas de MOVIMIENTO (duras)
- Animación instantánea y nítida, estilo HUD / radar / visor de caza.
- PROHIBIDO: spring, bounce, ease-in-out prolongado, cualquier física elástica.
- No introducir librerías de animación con defaults elásticos sin ajustarlos a los timings del DESIGN_SYSTEM.

## Reglas de INTERACCIÓN (UX)
- Descubrimiento progresivo, no scroll pasivo: el usuario opera una terminal.
- El Hero fija la escala geopolítica del problema; inmediatamente después empuja a la topología técnica.

## Proceso de build
- Sección por sección. **El Hero es el ancla**: una vez aprobado, es la referencia de consistencia para todo lo demás.
- Antes de construir una sección, leer su brief en `sections/` y el `DESIGN_SYSTEM.md`.
- Ante cualquier ambigüedad visual, preguntar — no improvisar fuera del sistema.

## Qué NO hacer
- No inventar datos ni métricas para "llenar" densidad.
- No introducir colores, radios, sombras o timings fuera del DESIGN_SYSTEM.
- No usar lenguaje de marketing, ni en el copy ni en los nombres de componentes.
- No renderizar el hardware/producto de forma fotorrealista (ver reglas de DISEÑO).
