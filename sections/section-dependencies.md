# sections/dependencies.md — Our Dependencies (Accordion Section)

> Brief para construir la sección de plataformas/dependencias.
> Antes de codear: leer `DESIGN_SYSTEM.md` y `CLAUDE.md`. Stack: Next.js (App Router).
> Anclas de referencia: filas grandes numeradas de **Palantir** (nombre enorme + `/0.x`) +
> patrón **acordeón expandible de Jonite** (clic → despliega overview + supporting docs).
> Todo traducido al **dark mode** del proyecto (texto claro sobre void negro, NO fondo claro).

## Propósito
Presentar las tres plataformas de Groasis como un índice técnico expandible. Cerradas, las
filas son limpias y sobrias; al hacer clic, cada una se despliega revelando su descripción y
sus documentos de soporte (whitepapers, patentes). Es el "evidence room" en miniatura:
demuestra con documentos, no persuade con copy.

## Encabezado de sección
- Rótulo arriba: **OUR DEPENDENCIES** (estilo etiqueta, mono pequeño, `--color-text-muted`).
  (Reemplaza el "Our Software" de la referencia.)

## Estructura: filas de acordeón
Tres filas, una por plataforma. Numeradas `/01`, `/02`, `/03` a la derecha (estilo Palantir).

Estado **cerrado** (por defecto):
- Número grande a la izquierda + nombre de plataforma en grande (Space Grotesk), y a la
  derecha el número de índice (`/01`) y un icono **`+`** que indica que se expande.
- Separador de **1px** (`rgba(255,255,255,0.12)`) entre filas.
- Fila limpia: solo número, nombre y `+`. Nada más visible hasta abrir.

Estado **abierto** (al hacer clic en la fila):
- La fila se despliega hacia abajo revelando dos zonas (como Jonite):
  - **Izquierda — Overview:** la descripción corta (la misma del Intelligence Vault) como
    titular del overview, y opcionalmente un párrafo más largo debajo en texto atenuado.
  - **Derecha — Supporting Docs:** lista de documentos descargables con rótulo
    "SUPPORTING DOCS" + contador ("0X AVAILABLE"). Cada doc: icono + nombre + tipo/peso
    (en mono, ej. "PDF — 23.3 MB") + acción "DOWNLOAD ↓".
- El icono `+` rota/cambia a `−` (o `×`) al abrir.
- Solo una fila abierta a la vez (acordeón clásico): abrir otra cierra la anterior. (Si
  prefieres permitir varias abiertas, indicarlo; por defecto, una.)

## Contenido (las 3 plataformas)
Reusar las descripciones del Intelligence Vault:
- `/01` **GT-AERO** — "Strategic automation and propulsion"
- `/02` **PHOTON** — "Cellular reengineering through light"
- `/03` **TELECO** — "Next-generation communication infrastructure"
(El párrafo largo de cada una y los docs van como placeholder por ahora — ver abajo.)

## Supporting Docs (PLACEHOLDER — conectar PDFs reales después)
Por ahora NO existen los documentos reales. Estructura el componente con **placeholders
claramente marcados** (nombres y pesos de ejemplo), listo para conectar archivos reales:
- Ej.: "GT-AERO Whitepaper · PDF — 0.0 MB · DOWNLOAD", "Patent Filing · PDF — 0.0 MB", etc.
- **No inventar documentos como si fueran reales.** Marcarlos como placeholder en el código
  (comentario) para que sea obvio qué reemplazar.
- Estos docs son la evidencia que sostiene la voz "demostramos, no persuadimos": deben ser
  reales antes de publicar.

## Links / navegación — DOS zonas de clic por fila
Cada fila tiene **dos acciones distintas**, en dos zonas separadas:
- **Clic en el `+`** (a la derecha): **expande/colapsa** el acordeón en el mismo lugar
  (overview + supporting docs). NO navega.
- **Clic en el NOMBRE de la plataforma** (GT-AERO, PHOTON, TELECO): **navega a la página
  correspondiente** de esa plataforma (su ruta dedicada).

### Distinción visual (CRÍTICO para usabilidad)
Las dos zonas deben verse y comportarse distinto para que el usuario sepa qué hace cada una
sin adivinar:
- El **`+`** comunica "expandir" (convención universal). Al abrir, cambia a `−`/`×`.
- El **nombre** (link de navegación) debe señalar que lleva fuera: al hover, el nombre se
  ilumina a blanco pleno y/o aparece una flecha diagonal **`↗`** junto a él (convención de
  "navegar a otra página"), claramente diferente del `+`.
- Así: `↗`/iluminación = "te llevo a la página"; `+` = "te abro aquí mismo".
- Asegurar que las zonas de clic (hit areas) no se solapen: picar el `+` nunca debe navegar,
  picar el nombre nunca debe expandir.

- Los documentos de la zona derecha (dentro del acordeón abierto) son descargables (cuando
  sean reales).

## Animaciones
### A) Aparición de las filas (al entrar en viewport)
- Cada fila aparece con **fade + rise corto** (~15-20px de desplazamiento hacia arriba),
  **escalonadas** (stagger ~60-80ms entre fila y fila): primero /01, luego /02, luego /03.
- Una sola vez al entrar en pantalla. Curva `cubic-bezier(0,0,0.2,1)`, ~120ms por fila.
  Sin rebote, sin elasticidad. Sobrio y orgánico — contraste deliberado con el scroll
  pesado de la sección Statement anterior.

### B) Expansión del acordeón (al clic)
- El alto de la fila crece suave (~200-250ms, `cubic-bezier(0,0,0.2,1)`), y el contenido
  interno (overview + docs) aparece con un fade corto justo después.
- El icono `+` → `−`/`×` con transición nítida (~100ms, sin rotación con rebote).
- Al cerrar, lo inverso: el contenido se desvanece, el alto se colapsa.

### Reduced motion
- Respetar `prefers-reduced-motion`: sin rise ni stagger en la aparición (fade simple o
  directo), y la expansión del acordeón sin animación de alto (abre/cierra directo).

## Estándares (CLAUDE.md / DESIGN_SYSTEM.md)
- Dark mode: void negro, texto claro. **NUNCA fondo claro** (la referencia Jonite/Palantir
  es clara; nosotros la invertimos).
- Bordes 1px, cero `box-shadow`, esquinas a 0px.
- Mono (JetBrains Mono) para rótulos, números de índice, tipos/pesos de archivo. Space
  Grotesk para los nombres de plataforma y overview.
- Voz clínica, sin marketing. Los docs son la prueba.

## Criterio de "listo"
- Tres filas limpias cerradas (número + nombre + `/0x` + `+`), separadas por 1px.
- **Dos zonas de clic por fila:** el `+` expande/colapsa en el sitio; el nombre navega a la
  página de la plataforma. Visualmente distinguibles (nombre con hover/`↗`, `+` para abrir).
  Hit areas que no se solapan.
- Clic en `+` expande una fila mostrando overview (izq) + supporting docs (der); solo una abierta a la vez.
- Aparición con fade + rise + stagger al entrar en viewport; expansión suave al clic.
- Docs como placeholder marcado, listos para conectar reales.
- Dark mode coherente, sin box-shadow, esquinas a 0px.
- Funciona con `prefers-reduced-motion`.

## Lente de referencia
Filas grandes numeradas = Palantir. Acordeón con overview + supporting docs = Jonite.
Ambas en claro; nosotros las llevamos a dark mode. Lo que tomamos: la estructura de filas
expandibles con documentos de soporte. Lo que descartamos: el fondo claro y el tono
comercial. Si el acordeón con dos columnas (overview + docs) se siente cargado en un MVP,
la alternativa de respaldo es expandir solo el overview (sin la columna de docs) y sumar
los docs después. Construir, ver, decidir.
