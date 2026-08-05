/**
 * Escala base del design system
 * 
 * Un único vocabulario de tamaños — xs, sm, md, lg, xl, 2xl — compartido por
 * espaciado, radios, iconos y componentes. Cuando un componente expone una
 * prop `size`, sus valores salen de aquí: así "md" significa lo mismo en un
 * botón, en un input y en un icono.
 * 
 * Regla de la casa — quién guarda qué:
 *
 *  - `style.css` (`@theme`) guarda los VALORES de todo lo que solo sirve para
 *    pintar: espaciado, radios, tipografía y sombras. Tailwind genera una
 *    utilidad por token (`gap-md`, `rounded-lg`, `text-body-md`).
 *  - Esta carpeta guarda las RECETAS (qué token usa cada componente) y los
 *    números que JavaScript necesita de verdad: tamaños de icono para lucide,
 *    breakpoints para `matchMedia`, duraciones para framer-motion.
 *
 * Nada vive en los dos sitios. Si te encuentras copiando un número del CSS a un
 * `.ts`, casi seguro que lo que hacía falta era una utilidad con nombre.
 *
 * Las clases se escriben LITERALES: Tailwind escanea el código fuente y no
 * detecta nombres construidos por interpolación.
 */


/** Orden canónico de la escala. Sirve para recorrerla o pintar catálogos. */
export const SIZE_SCALE = [
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl"
] as const;



/** Nombre de un escalón de la escala. */
export type SizeToken = (typeof SIZE_SCALE)[number];



/** Mapa completo de la escala a un valor cualquiera. */
export type SizeMap<T> = Record<SizeToken, T>;



/** Escalón por defecto de todo componente que no reciba `size`. */
export const DEFAULT_SIZE: SizeToken = "md";



/** Raíz tipográfica del navegador: 1rem = 16px. */
export const REM_BASE = 16;



/**
 * Paso mínimo de la retícula. Todo espaciado y todo alto de control es
 * múltiplo de 4px, que es lo que mantiene las filas alineadas entre sí.
 */
export const GRID_STEP = 4;



/** Convierte px a rem — para los estilos en línea que no pasan por Tailwind. */
export const toRem = (px: number): string => `${px / REM_BASE}rem`;
