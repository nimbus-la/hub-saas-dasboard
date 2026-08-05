import { cva } from "class-variance-authority";

import { ELEVATION, RADIUS_CLASS, TRANSITION } from "@/tokens";


/**
 * Estilos del combobox
 * 
 * Traducción al sistema de los primitivos de shadcn: `bg-popover`,
 * `bg-accent`, `text-muted-foreground` y `ring-foreground/10` apuntaban a
 * las variables de shadcn, que en este proyecto no son las de marca. Aquí
 * todo sale de la paleta neutral/primary y de la rampa tipográfica.
 * 
 * Igual que en `input-group.style.ts`, esto es el aspecto POR DEFECTO;
 * `input-selector.style.ts` lo afina por tamaño desde el componente público.
 */


/** Panel flotante de opciones. */
export const comboboxContentVariants = cva([
    "group/combobox-content relative isolate overflow-hidden",
    "max-h-(--available-height) w-(--anchor-width) max-w-(--available-width)",
    "min-w-[calc(var(--anchor-width)+--spacing(7))]",
    "origin-(--transform-origin)",
    "border border-neutral-200 bg-white text-neutral-800",
    RADIUS_CLASS.lg,
    ELEVATION.lg.class,
    "data-[chips=true]:min-w-(--anchor-width)",

    // Campo de búsqueda embebido en el panel: se hunde sobre el fondo para
    // que no compita con el campo real que hay fuera.
    "*:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0",
    "*:data-[slot=input-group]:h-8",
    "*:data-[slot=input-group]:border-neutral-200",
    "*:data-[slot=input-group]:bg-neutral-100",
    "*:data-[slot=input-group]:shadow-none",

    // Entrada y salida: se desliza desde el lado por el que se ancló.
    "duration-100",
    "data-[side=bottom]:slide-in-from-top-2",
    "data-[side=inline-end]:slide-in-from-left-2",
    "data-[side=inline-start]:slide-in-from-right-2",
    "data-[side=left]:slide-in-from-right-2",
    "data-[side=right]:slide-in-from-left-2",
    "data-[side=top]:slide-in-from-bottom-2",
    "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
    "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
    "motion-reduce:animate-none motion-reduce:transition-none",
]);


/** Lista scrolleable de opciones. */
export const comboboxListVariants = cva([
    "no-scrollbar scroll-py-1 overflow-y-auto overscroll-contain p-1",
    "max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))]",
    "data-empty:p-0",
]);


/** Opción de la lista. */
export const comboboxItemVariants = cva([
    "relative flex w-full cursor-default items-center gap-2 py-1 pr-8 pl-1.5",
    "text-body-md text-neutral-800 outline-hidden select-none",
    RADIUS_CLASS.md,
    TRANSITION.colors,
    "data-highlighted:bg-neutral-100 data-highlighted:text-neutral-800",
    "data-disabled:pointer-events-none data-disabled:text-neutral-400",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
]);


/** Marca de la opción elegida. */
export const comboboxItemIndicatorVariants = cva([
    "absolute right-2 flex items-center justify-center text-primary-main",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg]:size-4",
]);


/** Rótulo de un grupo de opciones. */
export const comboboxLabelVariants = cva([
    "px-2 py-1.5 text-overline uppercase text-neutral-500",
]);


/** Mensaje de "sin resultados". */
export const comboboxEmptyVariants = cva([
    "hidden w-full justify-center py-2 text-center text-body-md text-neutral-600",
    "group-data-empty/combobox-content:flex",
]);


/** Separador entre grupos. */
export const comboboxSeparatorVariants = cva("-mx-1 my-1 h-px bg-neutral-200");


/** Chevron del disparador: gira al abrir el panel. */
export const comboboxTriggerVariants = cva([
    "group",
    "[&_svg]:transition-transform [&_svg]:duration-200",
    "motion-reduce:[&_svg]:transition-none",
    "data-[popup-open]:[&_svg]:rotate-180",
]);


/** Contenedor de selección múltiple. */
export const comboboxChipsVariants = cva([
    "flex min-h-10 w-full flex-wrap items-center gap-1 bg-white bg-clip-padding px-2.5 py-1",
    "border border-neutral-300 text-body-md text-neutral-800",
    RADIUS_CLASS.lg,
    TRANSITION.input,
    "hover:border-neutral-400",
    "focus-within:border-primary-main focus-within:ring-2 focus-within:ring-primary-main/15",
    "has-aria-invalid:border-error-main",
    "has-aria-invalid:focus-within:ring-error-main/15",
    "has-data-[slot=combobox-chip]:px-1",
]);


/** Etiqueta de un valor seleccionado. */
export const comboboxChipVariants = cva([
    "flex h-6 w-fit items-center justify-center gap-1 px-1.5",
    "bg-neutral-200 text-label-sm whitespace-nowrap text-neutral-800",
    RADIUS_CLASS.sm,
    "has-disabled:pointer-events-none has-disabled:cursor-not-allowed",
    "has-disabled:bg-neutral-100 has-disabled:text-neutral-400",
    "has-data-[slot=combobox-chip-remove]:pr-0",
]);


/** Input de escritura dentro de un campo de chips. */
export const comboboxChipsInputVariants = cva([
    "min-w-16 flex-1 bg-transparent text-neutral-800 outline-none",
    "placeholder:text-neutral-600",
]);
