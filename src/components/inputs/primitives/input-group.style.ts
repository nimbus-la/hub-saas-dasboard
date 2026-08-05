import { cva } from "class-variance-authority";

import { ELEVATION, FOCUS_RING, RADIUS_CLASS, TRANSITION } from "@/tokens";


/**
 * Estilos de los primitivos de campo
 * 
 * Estos son los antiguos primitivos de shadcn, ya traducidos al sistema: en
 * vez de `border-input`, `text-muted-foreground` o `ring-ring/50` —que apuntan
 * a las variables de shadcn— usan la paleta y la rampa de marca.
 * 
 * El primitivo pone el MÍNIMO: estructura, un aspecto razonable por defecto y
 * nada más. El alto, el radio, la tipografía y los estados los pinta encima el
 * componente público (`text-field.style.ts`, `input-selector.style.ts`) a
 * través de `className`, que llega el último a `cn()` y gana el desempate en
 * tailwind-merge.
 * 
 * Por eso aquí NO se pintan anillos de foco ni de error en el grupo: los dueños
 * de ese estado son las variantes `tone`/`invalid` del campo, y dos anillos
 * peleándose fue justo lo que obligaba antes a anularlos a mano.
 */


/** Contenedor del campo: la caja que agrupa control, adornos y botones. */
export const inputGroupVariants = cva([
    "group/input-group relative flex h-10 w-full min-w-0 items-center",
    "border border-neutral-300 bg-white outline-none",
    RADIUS_CLASS.lg,
    TRANSITION.input,

    // Tamaño de icono por defecto. Va como regla de descendencia simple —sin
    // `:not([class*='size-'])`— para que el `[&_svg]:size-*` de la receta del
    // campo la sustituya limpiamente en tailwind-merge en vez de competir por
    // especificidad.
    "[&_svg]:shrink-0",
    "[&_svg]:size-4",

    // Dentro del panel del combobox el campo de búsqueda no se resalta: ya
    // está dentro de una superficie enfocada.
    "in-data-[slot=combobox-content]:focus-within:border-inherit",
    "in-data-[slot=combobox-content]:focus-within:ring-0",

    // Deshabilitado — el campo público lo repinta con colores planos.
    "has-disabled:bg-neutral-100",

    // Crece cuando lleva adornos arriba/abajo o un textarea dentro.
    "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col",
    "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col",
    "has-[>textarea]:h-auto",

    // El control cede espacio al adorno que tenga al lado.
    "has-[>[data-align=block-end]]:[&>input]:pt-3",
    "has-[>[data-align=block-start]]:[&>input]:pb-3",
    "has-[>[data-align=inline-end]]:[&>input]:pr-1.5",
    "has-[>[data-align=inline-start]]:[&>input]:pl-1.5",
]);


/** Adorno: iconos, texto o botones pegados a un extremo del campo. */
export const inputGroupAddonVariants = cva(
    [
        "flex h-auto cursor-text items-center justify-center gap-2 py-1.5",
        "text-body-md text-neutral-600 select-none",
        "group-data-[disabled=true]/input-group:opacity-50",
        "[&>kbd]:rounded-sm",
    ],
    {
        variants: {
            align: {
                "inline-start":
                    "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
                "inline-end":
                    "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
                "block-start":
                    "order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
                "block-end":
                    "order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
            },
        },
        defaultVariants: { align: "inline-start" },
    }
);


/**
 * Botón interno del campo — la "x", el ojo de la contraseña, el chevron.
 *
 * Es fantasma por defecto: dentro de un campo, un botón con fondo propio
 * compite con el texto que el usuario está escribiendo.
 */
export const inputGroupButtonVariants = cva(
    [
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2",
        "border border-transparent bg-transparent whitespace-nowrap select-none",
        TRANSITION.colors,
        FOCUS_RING.default,
        "disabled:pointer-events-none disabled:text-neutral-400",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    ],
    {
        variants: {
            variant: {
                ghost: "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800",
                default: "bg-neutral-200 text-neutral-800 hover:bg-neutral-300",
            },
            size: {
                xs: ["h-6 gap-1 px-1.5 text-label-sm", RADIUS_CLASS.sm, "[&_svg]:size-3.5"],
                sm: ["h-7 gap-1 px-2 text-label-sm", RADIUS_CLASS.sm, "[&_svg]:size-4"],
                "icon-xs": ["size-6 p-0 has-[>svg]:p-0", RADIUS_CLASS.sm, "[&_svg]:size-3.5"],
                "icon-sm": ["size-8 p-0 has-[>svg]:p-0", RADIUS_CLASS.md, "[&_svg]:size-4"],
            },
        },
        defaultVariants: { variant: "ghost", size: "xs" },
    }
);


/** Texto suelto dentro del campo: sufijos, unidades, prefijos. */
export const inputGroupTextVariants = cva([
    "flex items-center gap-2 text-body-md text-neutral-600",
    "[&_svg]:pointer-events-none",
]);


/**
 * Control (input/textarea) cuando vive dentro de un grupo.
 *
 * Se desnuda por completo: el borde, el fondo y el anillo son del contenedor,
 * y dejarle los suyos dibujaría una caja dentro de otra.
 */
export const inputGroupControlVariants = cva([
    "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0",
    "focus-visible:ring-0 focus-visible:border-0",
    "disabled:bg-transparent",
    "aria-invalid:ring-0 aria-invalid:border-0",
]);


/** Variante del control para textarea: no se estira a mano. */
export const inputGroupTextareaVariants = cva([
    "flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0",
    "focus-visible:ring-0 focus-visible:border-0",
    "disabled:bg-transparent",
    "aria-invalid:ring-0 aria-invalid:border-0",
]);


/* -------------------------------------------------------------------------- */
/*  Campos sueltos (fuera de un grupo)                                         */
/* -------------------------------------------------------------------------- */

/**
 * Base compartida por `Input` y `Textarea` cuando se usan directamente.
 *
 * Reproduce el escalón `md` de `CONTROL_SIZE`. El texto sube a 16px por debajo
 * de `md` porque es el mínimo con el que iOS no hace zoom al enfocar.
 */
const standaloneField = [
    "w-full min-w-0 border border-neutral-300 bg-white",
    RADIUS_CLASS.lg,
    "text-label-lg md:text-label-md text-neutral-800",
    "placeholder:font-normal placeholder:text-neutral-600",
    "selection:bg-primary-lighter selection:text-primary-darker",
    "outline-none",
    TRANSITION.input,
    "hover:border-neutral-400",
    "focus-visible:border-primary-main focus-visible:ring-2 focus-visible:ring-primary-main/15",
    "aria-invalid:border-error-main",
    "aria-invalid:focus-visible:border-error-main aria-invalid:focus-visible:ring-error-main/15",
    "disabled:cursor-not-allowed disabled:border-neutral-300",
    "disabled:bg-neutral-100 disabled:text-neutral-600",
];

export const inputVariants = cva([
    ...standaloneField,
    "h-10 px-4 py-1",
    "file:inline-flex file:h-6 file:border-0 file:bg-transparent",
    "file:text-label-sm file:text-neutral-800",
]);

export const textareaVariants = cva([
    ...standaloneField,
    "flex field-sizing-content min-h-16 px-4 py-2 leading-relaxed",
]);


/** Sombra del panel flotante — el escalón que el sistema da a los desplegables. */
export const FIELD_POPUP_ELEVATION = ELEVATION.lg.class;
