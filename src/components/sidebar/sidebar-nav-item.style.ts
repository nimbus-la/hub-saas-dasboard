import { cva } from "class-variance-authority";

import { SPACING_CLASS } from "@/tokens";


/**
 * Estilos de SidebarNavItem
 *
 * El acordeón se anima con framer-motion —alto de `0` a `auto`, que ninguna
 * clase sabe hacer—, así que aquí solo queda el contenedor que lo recorta y el
 * riel del submenú.
 */


/** Caja que recorta el acordeón mientras crece o se pliega. */
export const sidebarSubmenuWrapperVariants = cva(["overflow-hidden"]);


/**
 * Riel del submenú.
 *
 * `ml-5.25` (21px) no sale de la escala de espaciado: es
 * `SIDEBAR.paddingX` (12) más medio icono (18/2), lo justo para que la línea
 * caiga bajo el centro del icono del padre. El `pl-3.5` que la sigue separa el
 * texto del sub-item de esa misma línea. Las dos son parte de la cadena
 * horizontal que documenta `sidebar-button.style.ts`; moverlas sin mover el
 * resto descuadra el indicador de selección de los sub-items.
 */
export const sidebarSubmenuVariants = cva([
    "my-1 ml-5.25 border-l border-neutral-300 pl-3.5",
    SPACING_CLASS.stack.xs,
]);
