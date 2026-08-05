/**
 * Layout
 *
 * Medidas del armazón de la aplicación: sidebar, barra superior, ancho de
 * contenido y el orden de apilamiento. Son valores que aparecen en varios
 * sitios a la vez — el ancho del sidebar lo necesita el propio sidebar y
 * también el desplazamiento del contenido — y desincronizarlos se nota al
 * instante.
 *
 * Este archivo sí guarda números: son medidas que JavaScript consume de verdad
 * (media queries en hooks, cálculos de desplazamiento, orden de capas). Las
 * clases que los acompañan son la cara CSS del mismo valor.
 */

/* ── Sidebar ──────────────────────────────────────────────────────────────── */

export const SIDEBAR = {
    /** Ancho desplegado. */
    width: 256,
    widthClass: "w-64",
    /** Ancho colapsado (modo raíl: solo iconos). */
    railWidth: 80,
    railWidthClass: "w-20",
    /** Alto del encabezado — cuadra con el de la barra superior. */
    headerHeight: 64,
    headerHeightClass: "h-16",
    /** Relleno horizontal de la zona de navegación. */
    paddingX: 12,
    paddingXClass: "px-3",
    /** Alto de un elemento de navegación. */
    itemHeight: 40,
    itemHeightClass: "h-10",
} as const;



/* ── Barra superior ───────────────────────────────────────────────────────── */

export const NAVBAR = {
    height: 64,
    heightClass: "h-16",
    paddingX: 16,
    paddingXClass: "px-4",
} as const;



/* ── Contenido ────────────────────────────────────────────────────────────── */

export const CONTENT = {
    /** Ancho máximo de una página de panel. Más allá, el ojo pierde la fila. */
    maxWidth: 1440,
    maxWidthClass: "max-w-[1440px]",
    /** Ancho máximo de una columna de texto continuo. */
    proseMaxWidth: 720,
    proseMaxWidthClass: "max-w-[720px]",
    /** Márgenes laterales del contenido. */
    gutter: 24,
    gutterClass: "px-6",
    /** Separación entre secciones. */
    sectionGap: 32,
    sectionGapClass: "gap-8",
} as const;



/* ── Puntos de corte ──────────────────────────────────────────────────────── */

/**
 * Los cinco grandes son los de Tailwind y `xs` está declarado en `@theme`
 * (`--breakpoint-xs`). Existen aquí porque un `matchMedia` dentro de un hook
 * necesita el número: no hay forma de leer una media query desde JS a partir de
 * una utilidad CSS. Si cambian en el CSS, cambian aquí.
 */
export const BREAKPOINT = {
    xs: 480,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
} as const;

/** Punto a partir del cual el sidebar deja de ser drawer y se ancla. */
export const DESKTOP_BREAKPOINT = BREAKPOINT.md;



/* ── Apilamiento ──────────────────────────────────────────────────────────── */

/**
 * Orden de capas. Una sola lista evita el clásico `z-[9999]` defensivo: si algo
 * queda por debajo de lo que debería, se corrige aquí y no en el componente.
 */
export const Z_INDEX = {
    base: 0,
    /** Cabeceras pegajosas de tabla y controles anclados dentro del contenido. */
    sticky: 10,
    /** Barra superior. */
    navbar: 40,
    /** Velo oscuro que cubre la página. */
    overlay: 40,
    /** Sidebar en modo drawer, por encima del velo. */
    drawer: 50,
    /** Modales y hojas de diálogo. */
    modal: 60,
    /**
     * Capas flotantes ancladas a un control: menús, selectores, popovers.
     *
     * Van por encima de la barra superior y de los modales a propósito. Se
     * montan en un portal, así que salen del contenedor y compiten en la raíz
     * con el chrome: un desplegable abierto desde la barra —o desde dentro de
     * un modal— tiene que taparlo, no esconderse debajo.
     */
    dropdown: 70,
    /** Notificaciones. */
    toast: 80,
    /** Tooltips: siempre lo último. */
    tooltip: 90,
} as const;


export const Z_INDEX_CLASS = {
    base: "z-0",
    sticky: "z-10",
    navbar: "z-40",
    overlay: "z-40",
    drawer: "z-50",
    modal: "z-[60]",
    dropdown: "z-[70]",
    toast: "z-[80]",
    tooltip: "z-[90]",
} as const;


export type BreakpointToken = keyof typeof BREAKPOINT;
export type ZIndexToken = keyof typeof Z_INDEX;
