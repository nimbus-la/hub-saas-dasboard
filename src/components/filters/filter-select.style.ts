import { cva } from "class-variance-authority";

import type { ControlSizeToken } from "@/interfaces";
import {
    CONTROL_SIZE,
    ELEVATION,
    FOCUS_RING,
    RADIUS_CLASS,
    TRANSITION,
} from "@/tokens";


/**
 * Estilos de FilterSelect
 *
 * El mismo desplegable que `InputSelector` con el marco quitado: sin borde,
 * sin fondo y sin anillo en reposo. Lo que queda es el texto, y eso cambia
 * quién dibuja el control.
 *
 * En un campo de formulario el borde es lo que dice "aquí se puede tocar", y
 * está siempre. Aquí no hay borde, así que el aviso lo da el **fondo al pasar
 * el puntero** —igual que en un botón fantasma—: en reposo el filtro es texto
 * dentro de la barra, y sólo al acercarse aparece la caja. Por eso el fondo
 * del hover y el del panel abierto son el mismo (`neutral-200`): abrir es
 * seguir tocando lo que ya se estaba tocando, y cambiar de color a mitad de
 * gesto haría parecer que se pulsó otra cosa.
 *
 * El resto sale entero de `CONTROL_SIZE`, como en `GenericButton`: alto,
 * relleno, separación, radio y tipografía. Así el filtro cuadra al píxel con
 * el buscador y el botón que tiene al lado en la misma fila.
 */


/**
 * Aplana una receta de tamaño en las clases que necesita un control con texto.
 *
 * Ver la nota de `generic-button.style.ts`: las clases salen literales de
 * `components.tokens.ts`, por eso se pueden componer con una función sin
 * romper el escaneo de Tailwind.
 */
const controlSize = (token: ControlSizeToken) => [
    token.heightClass,
    token.paddingXClass,
    token.gapClass,
    token.radiusClass,
    token.typographyClass,
];


/* -------------------------------------------------------------------------- */
/*  Disparador                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * El control tal y como se ve en la barra: texto, chevron y nada más.
 *
 * `w-auto` por defecto y no un ancho fijo. En un campo con borde el ancho fijo
 * es obligatorio —la caja se vería crecer al cambiar de valor—, pero aquí no
 * hay caja que ver: el control se ciñe a su texto, y el hueco sobrante de un
 * ancho reservado sólo dejaría el fondo del hover flotando lejos de la
 * etiqueta.
 */
export const filterSelectTriggerVariants = cva(
    [
        "inline-flex cursor-pointer select-none items-center whitespace-nowrap",
        "border-0 bg-transparent text-neutral-800",
        TRANSITION.colors,
        FOCUS_RING.default,

        // ── Reposo → hover → abierto ─────────────────────────────────────
        // El fondo es todo el estado que tiene el control, así que hover y
        // abierto comparten valor: ver la nota de arriba.
        "hover:bg-neutral-200",
        "data-popup-open:bg-neutral-200",

        // Sin valor elegido el texto baja un tono: es una indicación, no un
        // dato ya escogido.
        "data-placeholder:font-normal data-placeholder:text-neutral-600",

        // ── Iconos ───────────────────────────────────────────────────────
        // Un punto por debajo del texto: acompañan, no se leen.
        "[&_svg]:shrink-0 [&_svg]:text-neutral-500",
        "hover:[&_svg]:text-neutral-600",

        // ── Deshabilitado ────────────────────────────────────────────────
        // Sin borde ni fondo que apagar, lo único que puede decir "esto no se
        // toca" es el texto — y que el fondo deje de responder al puntero.
        "data-disabled:cursor-not-allowed data-disabled:text-neutral-400",
        "data-disabled:hover:bg-transparent",
        "data-disabled:[&_svg]:text-neutral-400",
        "data-disabled:hover:[&_svg]:text-neutral-400",
    ],
    {
        variants: {
            size: {
                xs: controlSize(CONTROL_SIZE.xs),
                sm: controlSize(CONTROL_SIZE.sm),
                md: controlSize(CONTROL_SIZE.md),
                lg: controlSize(CONTROL_SIZE.lg),
                xl: controlSize(CONTROL_SIZE.xl),
                "2xl": controlSize(CONTROL_SIZE["2xl"]),
            },

            /**
             * Dónde se apoya el contenido cuando sobra ancho — con `fullWidth`
             * o con un ancho impuesto desde fuera. Centrado por defecto: el
             * grupo icono + texto + chevron se lee como una sola pieza.
             */
            align: {
                start: "justify-start",
                center: "justify-center",
                end: "justify-end",
            },

            fullWidth: {
                true: "w-full",
                false: "w-auto",
            },
        },

        defaultVariants: {
            size: "md",
            align: "center",
            fullWidth: false,
        },
    }
);


/**
 * Valor elegido.
 *
 * `min-w-0` + `truncate`: dentro de un flex el texto no se encoge por su
 * cuenta, así que sin esto una etiqueta larga empujaría al chevron fuera del
 * control en vez de cortarse.
 */
export const filterSelectValueVariants = cva(["min-w-0 truncate"]);


/**
 * Chevron.
 *
 * Gira 180° al abrir en lugar de cambiar de glifo: el giro es continuo y dice
 * de dónde viene y adónde va el panel, mientras que un cambio de icono es un
 * salto que hay que interpretar. Se tiñe de marca mientras está abierto, igual
 * que el de `InputSelector`.
 */
export const filterSelectIconVariants = cva([
    "flex items-center justify-center",
    TRANSITION.transform,
    "data-popup-open:rotate-180",
]);


/* -------------------------------------------------------------------------- */
/*  Panel                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Panel flotante de opciones.
 *
 * Idéntico al de `InputSelector`, y a propósito: el disparador pierde el
 * marco, la lista no. `ELEVATION.lg` es el escalón que el sistema reserva para
 * desplegables, y la sombra ya viene teñida con el neutro de marca.
 *
 * `min-w-(--anchor-width)` en vez de `w-`: el panel nunca es más estrecho que
 * el control, pero puede crecer si una opción no cabe. Con el disparador
 * ceñido a su texto, un panel clavado a ese ancho cortaría las etiquetas
 * largas.
 */
export const filterSelectContentVariants = cva([
    "min-w-(--anchor-width) max-h-(--available-height) max-w-(--available-width)",
    "origin-(--transform-origin) overflow-hidden outline-none",
    "border border-neutral-200 bg-white",
    RADIUS_CLASS.lg,
    ELEVATION.lg.class,

    // Entrada y salida: se desliza desde el lado por el que se ancló.
    "duration-100",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=top]:slide-in-from-bottom-2",
    "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
    "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
    "motion-reduce:animate-none motion-reduce:transition-none",
]);


/**
 * Lista scrolleable.
 *
 * Barra fina y del color del sistema. Los selectores se duplican (`&&`) para
 * ganar en especificidad sin depender del orden, igual que en
 * `input-selector.style.ts`.
 */
export const filterSelectListVariants = cva([
    "max-h-60 overflow-y-auto overscroll-contain p-1",
    "[&&]:[scrollbar-width:thin]",
    "[&&]:[scrollbar-color:var(--color-neutral-300)_transparent]",
    "[&&::-webkit-scrollbar]:block [&&::-webkit-scrollbar]:w-1.5",
    "[&&::-webkit-scrollbar-track]:bg-transparent",
    "[&&::-webkit-scrollbar-thumb]:rounded-full",
    "[&&::-webkit-scrollbar-thumb]:bg-neutral-300",
]);


/**
 * Opción del panel.
 *
 * `selected` y `highlighted` empatan en especificidad, así que se separan con
 * variantes explícitas en vez de confiar en el orden — es el mismo motivo por
 * el que están escritas así en `input-selector.style.ts`.
 */
export const filterSelectItemVariants = cva(
    [
        "flex w-full cursor-pointer items-center outline-none select-none",
        "text-neutral-800",
        RADIUS_CLASS.md,
        TRANSITION.colors,
        "[&_svg]:shrink-0",

        "[&[data-highlighted]:not([data-selected])]:bg-neutral-100",
        "[&[data-highlighted]:not([data-selected])]:text-neutral-800",
        "[&[data-selected]]:bg-primary-lighter/60",
        "[&[data-selected]]:font-medium",
        "[&[data-selected]]:text-primary-dark",
        "[&[data-selected][data-highlighted]]:bg-primary-lighter",
        "data-disabled:cursor-not-allowed data-disabled:text-neutral-400",
    ],
    {
        variants: {
            size: {
                xs: "gap-2 px-2 py-1.5 text-body-sm",
                sm: "gap-2 px-2 py-1.5 text-body-sm",
                md: "gap-2 px-3 py-2 text-body-md",
                lg: "gap-3 px-3 py-2.5 text-body-lg",
                xl: "gap-3 px-4 py-2.5 text-body-lg",
                "2xl": "gap-3 px-4 py-3 text-body-lg",
            },
        },
        defaultVariants: { size: "md" },
    }
);


/**
 * Marca de la opción elegida.
 *
 * El tinte de fondo no basta: la opción activa tiene que distinguirse también
 * sin color. `ms-auto` la empuja al margen derecho, que es donde se busca.
 */
export const filterSelectIndicatorVariants = cva([
    "ms-auto flex items-center justify-center text-primary-main",
]);
