# sections/menu.md — Intelligence Vault (Menú) · MVP

> Brief para construir el menú. Antes de codear: leer `DESIGN_SYSTEM.md` (tokens, sección 6.A "Intelligence Vault") y las reglas de `CLAUDE.md`. Stack: Next.js (App Router).
>
> **Esto es un MVP / experimento.** Estructura inspirada en el patrón de FCTRY Lab (categorías que revelan info al lado), adaptada a panel derecho y a la estética oscura del proyecto. Si al verlo funcionando no convence, se reconstruye con ese lente — no asumir que esta es la versión final.

## Propósito
El menú es la "bóveda": al abrirlo, el usuario siente que accede a un índice clasificado. Navegación jerárquica donde lo que el cursor toca se vuelve protagonista y lo demás se atenúa. Monocromático, nítido, de instrumento.

## Estados

### Cerrado (disparador)
- El disparador ya existe en `Header.tsx`: el ícono de tres líneas. Reusarlo.
- Al abrir, las tres líneas se transforman en una **X** (transición nítida ~100ms, `cubic-bezier(0,0,0.2,1)`, sin rotación con rebote).

### Abierto (panel)
- **Panel lateral derecho**, ocupa el **50% del ancho** de la ventana, altura completa.
- El **50% izquierdo** (el resto del sitio) queda visible pero **difuminado y atenuado** detrás — refuerza la sensación de "capa clasificada encima". Usar `backdrop-filter: blur` sobre esa zona, dentro de la paleta.
- El panel tiene un **borde izquierdo de 1px** (`rgba(255,255,255,0.12)`) que lo separa del fondo.
- Fondo del panel: gris carbón translúcido coherente con el header (`rgba(38,40,45,0.3)` aprox.) con su `backdrop-blur`, o el `rgba(0,0,0,0.85)` de la spec de la bóveda — elegir el que mejor lea sobre el video; mantener oscuro.
- **Esquinas a 0px** (alineado al sistema; el redondeo del header fue excepción puntual, aquí no aplica salvo decisión explícita).
- Al abrir, **se congela el scroll** de la página de fondo.

## Layout interno del panel (dos zonas)
El panel se subdivide:
- **Zona izquierda (la lista):** las secciones navegables.
- **Zona derecha (el revelado):** info del item sobre el que está el cursor (idea tomada de FCTRY). En reposo (sin hover) esta zona está vacía o muestra un estado neutro.

## Contenido de la lista (dos bloques jerárquicos)

### Bloque primario — Plataformas (el producto)
Items grandes (Primary Display / Space Grotesk), cada uno con su numeración en mono (guiño HUD):
- `01` **GT-AERO** — descripción (placeholder, refinar en inglés): *"Strategic automation and propulsion"*
- `02` **PHOTON** — *"Cellular reengineering through light"*
- `03` **TELECO** — *"Next-generation communication infrastructure"*

### Bloque secundario — Secciones de soporte
Separado del primario por un espacio y/o una línea de 1px. Tamaño de texto **menor** que las plataformas (jerarquía):
- **Documentation** — (las patentes en isométrico)
- **Impact Studies** — (validaciones / casos)

## Comportamiento de hover (universal a todos los items)
Aplica igual a plataformas y a secciones de soporte:
1. **Acentuación:** el item bajo el cursor **crece ligeramente** y sube a blanco pleno (`--color-text`).
2. **Atenuación:** los demás items bajan de opacidad (se apagan), **solo opacidad, NO blur real** — mantener simple.
3. **Revelado:** en la **zona derecha** del panel aparece la info del item activo: su descripción de una línea y, si aplica, sus sub-links. Aparición nítida (no fade lento).
4. **Monocromático:** todo en blancos/grises. **NO usar el cian** — el acento operativo se reserva para datos técnicos, no para el menú.

## Reposo
- Sin hover, los tres/cinco items se ven **neutros e iguales** (un blanco medio, ~70% opacidad), esperando interacción. La jerarquía la crea el hover, no el reposo.
- La zona derecha (revelado) en reposo: vacía o con un estado neutro mínimo.

## Animaciones / timings
- Apertura/cierre del panel: **crossfade o slide corto, ~150ms** (sin deslizamientos largos), según `DESIGN_SYSTEM.md` sección 5.
- Hover (acentuar / atenuar / revelar): **~120–150ms** con `cubic-bezier(0,0,0.2,1)`. Nítido al disparar, continuo en la transición. **Sin spring, sin bounce.**
- Respetar `prefers-reduced-motion`: con la preferencia activa, los cambios son inmediatos sin movimiento.

## Notas Next.js / accesibilidad
- Componente cliente (`"use client"`) por el estado abierto/cerrado y los eventos.
- **Esc** cierra el menú. Click en el 50% atenuado de fondo también cierra.
- Focus trap mientras está abierto; al cerrar, el foco vuelve al disparador.
- `aria-expanded` en el disparador; el panel con rol y label apropiados.
- Bloquear scroll del `body` mientras está abierto.

## Lo que NO va (es MVP)
- Sin columna de noticias, sin bloque de ofertas, sin footer (eso fue de Palantir / FCTRY; no en el MVP).
- Sin imágenes fotorrealistas de producto.
- Sin animaciones cinemáticas tipo Locomotive (reservadas para v2).
- Sin el cian en ningún estado del menú.

## Criterio de "listo"
- Panel derecho al 50%, fondo izquierdo difuminado y atenuado, borde izquierdo de 1px.
- Disparador → X al abrir; Esc y click-fuera cierran; scroll de fondo congelado.
- Reposo neutro; hover acentúa el item, atenúa los demás (solo opacidad) y revela su info a la derecha.
- Dos bloques jerárquicos (plataformas grandes / soporte chico).
- Monocromático, sin cian. Esquinas a 0px. Cero box-shadow.
- Funciona con `prefers-reduced-motion`.

## Lente de referencia (para evaluar el resultado)
Patrón base: FCTRY Lab — categoría que, al interactuar, revela sus hijos/info en una zona contigua. Lo que tomamos: esa **jerarquía revelada**. Lo que descartamos: su fondo claro, su naturaleza e-commerce, sus imágenes de producto, el footer. Si al construirlo el revelado lateral se siente forzado o complejo de más para un MVP, la alternativa de respaldo es: panel derecho con **solo la lista** (hover acentúa/atenúa, sin zona de revelado) — más simple aún. Construir, ver, y decidir sobre el resultado real.
