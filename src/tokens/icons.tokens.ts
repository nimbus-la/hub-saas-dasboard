import {
    ArrowLeft,
    ArrowRight,
    Home,
    ImageUp,
    ListFilter,
    Package,
    PackageSearch,
    ClipboardList,
    ShoppingBasket,
    SquarePen,
    Tags,
    Trash2,
    TriangleAlert,
    Users,
    PanelRightClose,
    PanelRightOpen,
    Flame,
    Plus,
    Search,
    X,
} from "lucide-react";

import type { SizeMap } from "./scale.tokens";


/**
 * Registro de iconos
 * 
 * Un único punto donde se decide qué icono representa cada concepto. Los
 * componentes importan el token, no el icono de lucide: cambiar el glifo de
 * "productos" en toda la app es editar una línea de aquí.
 */

export const ICON_TOKENS = {
    /* ── Secciones ────────────────────────────────────────────────────────── */
    DASHBOARD: Home,
    PRODUCTS: Package,
    /** Categorías de la carta — la agrupación, no el producto. */
    CATEGORIES: Tags,
    INVENTORY: ClipboardList,
    ORDERS: ShoppingBasket,
    EMPLEOYES: Users,

    /* ── Acciones ─────────────────────────────────────────────────────────── */
    /** Crear un registro nuevo. */
    CREATE: Plus,
    /** Editar un registro existente. */
    EDIT: SquarePen,
    /** Eliminar un registro. Siempre detrás de una confirmación. */
    DELETE: Trash2,
    /** Buscar dentro de una colección. */
    SEARCH: Search,
    /** Acotar una colección por un criterio cerrado. */
    FILTER: ListFilter,
    /** Volver a la pantalla anterior — el par de `NEXT`. */
    BACK: ArrowLeft,
    /** Avanzar al siguiente paso de un flujo. */
    NEXT: ArrowRight,
    /** Subir una imagen desde el equipo. */
    UPLOAD_IMAGE: ImageUp,

    /* ── Estados ──────────────────────────────────────────────────────────── */
    /** Una búsqueda o un filtro que no devolvió nada. */
    NO_RESULTS: PackageSearch,
    /** Aviso de una acción irreversible. */
    WARNING: TriangleAlert,

    /* ── Chrome ───────────────────────────────────────────────────────────── */
    PANEL_RIGHT_OPEN: PanelRightOpen,
    PANEL_RIGHT_CLOSE: PanelRightClose,
    FLAME: Flame,
    CLOSE: X,
} as const;


export type IconToken = keyof typeof ICON_TOKENS;


/**
 * Tamaños de icono 
 * 
 * Un icono acompaña al texto, no compite con él: por eso la escala va un
 * punto por debajo del alto del control que lo contiene. `COMPONENT_TOKENS`
 * ya empareja cada tamaño de control con el suyo, así que en un botón o un
 * input basta con leer de ahí.
 * 
 * Los iconos de lucide reciben el tamaño por prop numérica (`size={16}`);
 * cuando el icono va dentro de un contenedor estilado con Tailwind se usa la
 * clase equivalente para no mezclar dos fuentes de verdad.
 */

/** Escala de tamaños de icono en px. */
export const ICON_SIZE = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
} as const satisfies SizeMap<number>;



/**
 * Clase de Tailwind equivalente a cada tamaño.
 *
 * Van con utilidad numérica y no con nombre porque el icono NO sigue la escala
 * de espaciado: `size-md` existe y vale 12px, que no es el icono `md` (16px).
 * Indexar este mapa es la forma correcta; escribir `size-md` a mano, no.
 */
export const ICON_SIZE_CLASS = {
    xs: "size-3",
    sm: "size-3.5",
    md: "size-4",
    lg: "size-4.5",
    xl: "size-5",
    "2xl": "size-6",
} as const satisfies SizeMap<string>;



/**
 * Grosor de trazo.
 *
 * Lucide dibuja a 2px por defecto. A tamaños pequeños el trazo grueso empasta
 * el glifo y a tamaños grandes se ve endeble, así que se compensa: cuanto más
 * grande el icono, más fino el trazo.
 */
export const ICON_STROKE = {
    /** Iconos decorativos o de acompañamiento. */
    light: 1.5,

    /** Valor por defecto — el de la mayoría de la interfaz. */
    regular: 2,

    /** Iconos que cargan significado por sí solos (estados, alertas). */
    bold: 2.25,
} as const;



/** Trazo recomendado según el tamaño del icono. */
export const ICON_STROKE_BY_SIZE = {
    xs: ICON_STROKE.bold,
    sm: ICON_STROKE.regular,
    md: ICON_STROKE.regular,
    lg: ICON_STROKE.regular,
    xl: ICON_STROKE.light,
    "2xl": ICON_STROKE.light,
} as const satisfies SizeMap<number>;



export type IconSizeToken = keyof typeof ICON_SIZE;
export type IconStrokeToken = keyof typeof ICON_STROKE;
