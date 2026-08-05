import { cva } from "class-variance-authority";

import { AVATAR_SIZE, RADIUS_FULL_CLASS } from "@/tokens";

/* -------------------------------------------------------------------------- */
/*  Estilos del Avatar                                                         */
/*                                                                             */
/*  El tamaño se declara una sola vez, en la raíz, y las piezas de dentro      */
/*  —iniciales, punto de estado, contador del grupo— lo leen del               */
/*  `data-size` del padre. Por eso sus escalones van escritos literales con    */
/*  la variante `group-data-*` delante: la clase compuesta no se puede armar   */
/*  por interpolación porque Tailwind no la vería. El lado en píxeles sí sale  */
/*  de `AVATAR_SIZE`, que es la receta del sistema.                            */
/* -------------------------------------------------------------------------- */

/**
 * Raíz.
 *
 * El borde va en un `::after` en vez de en el propio elemento: dibujado
 * encima de la imagen la recorta limpiamente, y con `mix-blend-darken` no se
 * ve una línea gris sobre las fotos claras.
 */
export const avatarVariants = cva(
    [
        "group/avatar relative flex shrink-0 select-none",
        RADIUS_FULL_CLASS,
        "after:absolute after:inset-0 after:rounded-full",
        "after:border after:border-neutral-300 after:mix-blend-darken",
    ],
    {
        variants: {
            size: {
                xs: AVATAR_SIZE.xs.sizeClass,
                sm: AVATAR_SIZE.sm.sizeClass,
                md: AVATAR_SIZE.md.sizeClass,
                lg: AVATAR_SIZE.lg.sizeClass,
                xl: AVATAR_SIZE.xl.sizeClass,
                "2xl": AVATAR_SIZE["2xl"].sizeClass,
            },
        },
        defaultVariants: { size: "md" },
    }
);


/** Imagen. Recortada en cuadrado para que no se deforme al redondearla. */
export const avatarImageVariants = cva([
    "aspect-square size-full object-cover",
    RADIUS_FULL_CLASS,
]);


/**
 * Iniciales — lo que se ve cuando no hay foto o falla la carga.
 *
 * La tipografía espeja el `typographyClass` de cada escalón de `AVATAR_SIZE`.
 */
export const avatarFallbackVariants = cva([
    "flex size-full items-center justify-center",
    "bg-neutral-200 text-neutral-600",
    RADIUS_FULL_CLASS,
    "group-data-[size=xs]/avatar:text-label-xs",
    "group-data-[size=sm]/avatar:text-label-sm",
    "group-data-[size=md]/avatar:text-label-md",
    "group-data-[size=lg]/avatar:text-label-md",
    "group-data-[size=xl]/avatar:text-label-lg",
    "group-data-[size=2xl]/avatar:text-label-xl",
]);


/**
 * Punto de estado en la esquina.
 *
 * Lleva anillo del color del fondo para separarse del avatar, y sube de capa
 * porque el `::after` de la raíz se pinta después de los hijos y si no lo
 * taparía. En los tamaños pequeños el icono se oculta: por debajo de 10px no
 * se lee y el color ya dice lo que hay que saber.
 */
export const avatarBadgeVariants = cva([
    "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center",
    "bg-primary-main text-white ring-2 ring-white select-none",
    RADIUS_FULL_CLASS,

    "group-data-[size=xs]/avatar:size-2 group-data-[size=xs]/avatar:[&>svg]:hidden",
    "group-data-[size=sm]/avatar:size-2.5 group-data-[size=sm]/avatar:[&>svg]:size-2",
    "group-data-[size=md]/avatar:size-3 group-data-[size=md]/avatar:[&>svg]:size-2",
    "group-data-[size=lg]/avatar:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-2.5",
    "group-data-[size=xl]/avatar:size-4 group-data-[size=xl]/avatar:[&>svg]:size-3",
    "group-data-[size=2xl]/avatar:size-5 group-data-[size=2xl]/avatar:[&>svg]:size-3.5",
]);


/**
 * Pila de avatares.
 *
 * Se solapan 8px y cada uno lleva un anillo blanco: sin él la pila se lee
 * como una mancha en vez de como caras separadas.
 */
export const avatarGroupVariants = cva([
    "group/avatar-group flex -space-x-2",
    "*:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-white",
]);


/** Contador del resto de la pila ("+3"). Copia el tamaño de sus avatares. */
export const avatarGroupCountVariants = cva([
    "relative flex shrink-0 items-center justify-center",
    "bg-neutral-200 text-neutral-600 ring-2 ring-white",
    RADIUS_FULL_CLASS,

    "group-has-data-[size=xs]/avatar-group:size-6",
    "group-has-data-[size=xs]/avatar-group:text-label-xs",
    "group-has-data-[size=sm]/avatar-group:size-8",
    "group-has-data-[size=sm]/avatar-group:text-label-sm",
    "group-has-data-[size=md]/avatar-group:size-10",
    "group-has-data-[size=md]/avatar-group:text-label-md",
    "group-has-data-[size=lg]/avatar-group:size-12",
    "group-has-data-[size=lg]/avatar-group:text-label-md",
    "group-has-data-[size=xl]/avatar-group:size-16",
    "group-has-data-[size=xl]/avatar-group:text-label-lg",
    "group-has-data-[size=2xl]/avatar-group:size-20",
    "group-has-data-[size=2xl]/avatar-group:text-label-xl",

    "[&>svg]:size-4",
    "group-has-data-[size=xs]/avatar-group:[&>svg]:size-3",
    "group-has-data-[size=xl]/avatar-group:[&>svg]:size-5",
    "group-has-data-[size=2xl]/avatar-group:[&>svg]:size-6",
]);
