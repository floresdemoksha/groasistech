# GROASIS TECH - MASTER DESIGN SYSTEM (V2.2 - TECHNICAL BLUEPRINT)

> Cambios v2.2: se añade la excepción de **fondo cinematográfico** del Hero (sección 1)
> y la aclaración **video atmosférico vs. render de producto** (sección 6.B), para que
> este archivo concuerde con `CLAUDE.md`.

## 1. Ontología del Color (Dark Mode Nativo)
Inspirado en ecosistemas de análisis de datos críticos, el fondo no es un lienzo, es un vacío sobre el cual se proyecta luz técnica.
* **Base Void:** `#000000` (Base por defecto: márgenes exteriores y fondo general del sitio. El Hero usa video — ver *Fondo Cinematográfico*).
* **Vault Surface:** `#0B0E11` a `#111418` (Para el fondo de los planos isométricos y contenedores de lectura).
* **Structural Borders:** `rgba(255, 255, 255, 0.12)`. Todos los bordes son de 1px. Cero sombras (box-shadow). La profundidad se logra mediante cambios sutiles en la luminosidad del fondo.
* **Data Accents (Cromatismo Industrial):** 
  * Cian Operativo (`#00B3A4`): Para nodos activos, componentes aeroespaciales en el isométrico y variables matemáticas.
  * Blanco Absoluto (`#FFFFFF`): Exclusivamente para tipografía de Nivel 1 y métricas de alto impacto.
* **Fondo Cinematográfico (Excepción Deliberada — solo Hero y divisores atmosféricos puntuales):** El Hero usa video cinematográfico oscuro y técnico como fondo. Es **atmósfera ambiental, no representación de producto** (ver 6.B). El resto del sitio mantiene el Base Void.
  * **Scrim de legibilidad (obligatorio sobre el video):** se compone con negros translúcidos dentro de esta paleta, sin introducir colores nuevos. Dos capas: (1) degradado superior detrás del header para anclar la barra; (2) oscurecimiento/viñeta general centrado en el titular. El video nunca compite con el texto.

## 2. Tipografía: Densidad y Matemática
Se prohíben las fuentes decorativas. La tipografía es la principal herramienta de autoridad.
* **Primary Display (Títulos de Patentes/Secciones):** *Inter* o *Helvetica Neue*. 
  * Regla: `font-weight: 600`, `letter-spacing: -0.02em`. Debe verse compacto y denso.
* **Technical Monospace (Fichas Técnicas/Telemetría):** *SF Mono*, *JetBrains Mono* o *Consolas*. 
  * Uso: Para todas las métricas de hardware, números de registro de las patentes, coeficientes físicos y UI del HUD.
* **Rigor Matemático:** Todos los whitepapers y fórmulas dentro del "Intelligence Vault" y el "Evidence Room" deben renderizarse obligatoriamente bajo notación **LaTeX** pura (ej. ecuaciones de fotobiomodulación o modelos topológicos) para establecer autoridad inmediata.

## 3. Sistema Espacial y Layout (The 8px Grid)
El rigor exige proporciones matemáticas estrictas. Todo el sistema de espaciado se basa en una cuadrícula dura de **8px**. No hay valores arbitrarios (ej. nada de 15px o 25px).
* **--space-1 (Micro):** `8px` (Espaciado interno en componentes densos, celdas de telemetría).
* **--space-2 (Tight):** `16px` (Separación entre labels técnicos y valores).
* **--space-3 (Base):** `24px` (Padding estándar de tarjetas isométricas).
* **--space-4 (Loose):** `32px` (Separación entre bloques de información en fichas).
* **--space-8 (Macro):** `64px` (Separación entre secciones de la bóveda).
* **--space-12 (Vast):** `96px` (Margen superior/inferior para las capas arquitectónicas principales).

## 4. Breakpoints y Comportamiento Responsivo
El diseño debe mantener la "Densidad Tecnológica" en cualquier pantalla sin colapsar en listas interminables desordenadas.
* **Mobile (SM - 320px a 767px):** Las tablas técnicas se convierten en bloques apilados. El carrusel se navega por *swipe*.
* **Tablet/Terminal (MD - 768px a 1023px):** Rejilla de 2 columnas para especificaciones. Se activa la pre-visualización isométrica en HUD.
* **Desktop Vault (LG - 1024px a 1439px):** Experiencia principal. El "Intelligence Vault" lateral se ancla o se despliega a pantalla completa sin problemas de solapamiento.
* **Command Center (XL - 1440px+):** Máxima densidad. Se habilita el modo "Exploded View" interactivo con telemetría lateral fija.

## 5. Cinética y Transiciones (Grado Militar)
Cero físicas elásticas, cero rebotes. Las animaciones simulan equipos tácticos y pantallas de radar.
* **Timing Base:** `80ms` a `120ms` máximo.
* **Easing Curve:** `cubic-bezier(0, 0, 0.2, 1)` (ease-out). Arranca rápido, aterriza en seco.
* **Interacciones (Hover/HUD):** Aparición instantánea. Cuando un puntero toca un componente del isométrico, el HUD técnico debe aparecer en `< 80ms`.
* **Transiciones de Bóveda:** El despliegue del menú o transiciones entre "Aero" y "Photon" usan un fundido cruzado (crossfade) en `150ms` sin movimiento espacial excesivo (sin deslizamientos largos).
* **Reduced Motion:** respetar `prefers-reduced-motion`. Con la preferencia activa: el video del Hero no se reproduce (se muestra su poster estático) y las animaciones se reducen a un cambio de estado inmediato sin movimiento.

## 6. Especificación de Componentes Clave

### A. The Intelligence Vault (Menú de Bóveda)
* **Comportamiento:** Reemplaza el Menú Hamburguesa tradicional. Al activarse, congela el *scroll* de la página y despliega un *Overlay* de pantalla completa (`backdrop-filter: blur(12px); background: rgba(0,0,0,0.85)`).
* **Estructura Interna:** Pantalla dividida. Izquierda: Navegación jerárquica tipo árbol de directorios (Aero, Photon, Teleco). Derecha: "Validation Layer" mostrando sellos estáticos, folios de patentes y estados jurisdiccionales.

### B. Isometría Analítica y Fichas Técnicas
* **Prohibición de Renders Fotorrealistas:** Toda representación del hardware y las patentes debe ser mediante *Isometría Analítica de Línea Clara* (estética de Blueprint de Manufactura). Se mostrarán vectores puros que insinúan planos técnicos listos para entrar a la línea de ensamblaje.
* **Aclaración (video vs. render):** El video cinematográfico de fondo del Hero (sección 1) es **atmósfera ambiental, no una representación del producto**. Esta excepción **NO autoriza renders 3D fotorrealistas del hardware**. El hardware y las patentes son SIEMPRE isometría de línea clara.
* **HUD Technical Callouts:** Sobre los diagramas isométricos flotarán puntos interactivos. Al hacer *hover*, no despliegan un simple globo de texto, sino una caja de terminal con diseño de 1px de borde mostrando telemetría (Material, Coeficientes, Voltajes) en estricto apego al timing `< 80ms`.

### C. Digital Patent Carousel (The Warp Speed Interface)
* **Maquetación:** Sistema de grilla horizontal (overflow-x) que rompe el contenedor principal. 
* **Interactividad:** El *scroll* debe sentirse pesado pero preciso. Cada tarjeta visible es una patente secundaria con metadatos técnicos altamente densos condensados en un espacio reducido.

## 7. Estándares de Codificación de Interfaz (Frontend)
* Todas las cajas (`div`, `section`) deben tener `border-radius: 0px` o un máximo absoluto de `2px`. Las esquinas afiladas comunican precisión industrial.
* Utilizar CSS Grid de manera agresiva para estructurar las Fichas Técnicas simulando tablas de especificaciones militares.
