import { cva } from "class-variance-authority";

import {
    CONTROL_SIZE,
    FOCUS_RING,
    NAVBAR,
    RADIUS_FULL_CLASS,
    SPACING_CLASS,
    TRANSITION,
    TYPOGRAPHY,
    Z_INDEX_CLASS,
} from "@/tokens";


/**
 * Estilos de la Navbar
 *
 * El armazón sale de `NAVBAR` y `Z_INDEX`: 64px de alto —el mismo que el
 * encabezado del sidebar, para que la línea inferior de los dos sea la misma— y
 * la capa `navbar`, por debajo de los desplegables a propósito.
 *
 * Los botones de icono van en `CONTROL_SIZE.md` (40px). Son los únicos
 * objetivos táctiles de la aplicación en móvil —abrir el menú, el selector de
 * sucursal, las notificaciones— y 40px es el mínimo cómodo. Los del encabezado
 * del sidebar se quedan en `sm`: son acciones secundarias de una superficie que
 * en móvil ni siquiera se ve.
 */


/** Barra. */
export const navbarVariants = cva([
    "sticky top-0 border-b border-neutral-200 bg-white",
    NAVBAR.heightClass,
    Z_INDEX_CLASS.navbar,
]);


/** Fila de contenido. */
export const navbarInnerVariants = cva([
    "relative flex h-full items-center justify-between",
    SPACING_CLASS.gap.lg,
    NAVBAR.paddingXClass,
    "md:px-6",
]);


/** Grupos de la izquierda y de la derecha. */
export const navbarSectionVariants = cva([
    "flex items-center",
    SPACING_CLASS.gap.sm,
]);


/**
 * Botón de icono.
 *
 * Un solo radio, foco visible, sin sombra. El `active:scale-95` es la única
 * respuesta al toque que tiene la barra, y por eso lleva su propia anulación
 * para `prefers-reduced-motion`.
 */
export const navbarIconButtonVariants = cva([
    "flex shrink-0 cursor-pointer items-center justify-center text-neutral-600",
    CONTROL_SIZE.md.squareClass,
    CONTROL_SIZE.md.radiusClass,
    TRANSITION.colors,
    "hover:bg-neutral-100 hover:text-neutral-800",
    FOCUS_RING.default,
    "active:scale-95 motion-reduce:active:scale-100",
]);


/**
 * Punto de notificación.
 *
 * El anillo es del color de la barra, no un borde: así el punto se recorta
 * sobre el icono sin taparlo. Sus 6px y su posición no salen de la retícula —
 * son la esquina del icono que hay debajo.
 */
export const navbarNotificationDotVariants = cva([
    "absolute top-1.5 right-1.5 size-1.5 bg-error-main ring-2 ring-white",
    RADIUS_FULL_CLASS,
]);


/**
 * Caja del selector de sucursal en escritorio.
 *
 * El ancho vive aquí, en el contenedor, y el selector lo rellena con `w-full`.
 * Antes era al revés —el selector traía un `w-xs` y el contenedor solo lo
 * recortaba con `max-w`—, que funciona pero deja el tamaño repartido entre dos
 * sitios: al quitarle el `w-xs` al hijo, el campo se encogía sin que nada en
 * el contenedor lo delatara.
 */
export const navbarBranchSelectorVariants = cva([
    "hidden w-50 sm:block lg:w-xs",
]);


/** Bloque de perfil, separado del resto por una línea. */
export const navbarProfileVariants = cva([
    "ml-2 flex items-center border-l border-neutral-300 pl-3",
    SPACING_CLASS.gap.md,
]);


/** Nombre y rol — se ocultan por debajo de `sm`, donde manda el avatar. */
export const navbarProfileTextVariants = cva(["hidden flex-col sm:flex"]);


export const navbarUserNameVariants = cva([
    "text-neutral-800",
    TYPOGRAPHY.labelMd,
]);


export const navbarUserRoleVariants = cva([
    "text-neutral-600",
    TYPOGRAPHY.caption,
]);


/**
 * Selector de sucursal desplegado sobre la barra en móvil.
 *
 * Tapa la fila entera en vez de empujarla: con 360px de ancho no caben el
 * selector y las acciones a la vez, y desplazarlas haría saltar la barra.
 */
export const navbarBranchOverlayVariants = cva([
    "absolute inset-x-0 top-0 flex h-full items-center bg-white sm:hidden",
    SPACING_CLASS.gap.sm,
    NAVBAR.paddingXClass,
]);
