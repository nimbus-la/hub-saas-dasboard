import { cva } from "class-variance-authority";

import { genericButtonVariants } from "@/components/buttons/generic-button.style";
import {
    DURATION_CLASS,
    SPACING_CLASS,
    SURFACE_SIZE,
    TYPOGRAPHY,
} from "@/tokens";


/**
 * Estilos de Alert
 *
 * Traducción al sistema del `alert` de shadcn. El original resolvía la
 * composición con una rejilla y selectores de presencia
 * (`has-[>svg]:grid-cols-[auto_1fr]`, `*:[svg]:row-span-2`,
 * `has-data-[slot=alert-action]:pr-18`) para cubrir cualquier orden de piezas
 * sueltas, y pintaba con los tokens de shadcn —`bg-card`, `text-destructive`—
 * que no son los de este panel. Aquí el aviso es un componente cerrado: recibe
 * icono, título, descripción, acciones y la equis por props, así que el
 * esqueleto es uno solo y esos selectores desaparecen.
 *
 * La forma es la de una fila con tres piezas —medallón, textos, equis— sobre
 * el eje central: el medallón de color es lo primero que se ve y dice de qué
 * va el aviso antes de leer el título. Con acciones el eje se sube arriba
 * (`align`), porque un medallón centrado contra un bloque de tres líneas más
 * dos botones se queda flotando a media altura y deja de señalar al título.
 *
 * Los dos ejes de color se reparten así: `variant` decide la superficie
 * —tintada o blanca— y `tone` el significado. Solo se cruzan en la tintada,
 * que es la única donde el tono pinta el fondo y el borde; en la blanca el
 * tono se queda en el medallón, en la equis y en la barra de cuenta atrás. Es
 * lo que evita las diez combinaciones cruzadas que haría falta escribir si
 * cada variante repintara todo.
 */


/* -------------------------------------------------------------------------- */
/*  Caja                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Contenedor del aviso.
 *
 * `overflow-hidden` recorta la barra de cuenta atrás contra el radio de las
 * esquinas; sin él la barra sobresale por las dos inferiores.
 *
 * La entrada es un desvanecido con 4px de caída y la salida un desvanecido con
 * encogimiento, más corta que la entrada (150ms frente a 200ms): un elemento
 * que se va debe quitarse de en medio antes de que lo eche de menos el ojo. El
 * `motion-reduce:animate-none` deja las dos en un cambio seco cuando el
 * sistema pide menos movimiento.
 */
export const alertVariants = cva(
    [
        "group/alert relative isolate flex w-full overflow-hidden border",

        DURATION_CLASS.normal,
        "animate-in fade-in-0 slide-in-from-top-1",
        "data-closing:animate-out data-closing:fade-out-0 data-closing:zoom-out-95",
        // El escalón `fast` de la receta, escrito literal: una clase con
        // variante delante no se puede componer desde el token —Tailwind
        // escanea el código fuente y `data-closing:` + `duration-150` nunca
        // aparecen juntos en él—, así que la utilidad no se generaría.
        "data-closing:duration-150",
        "motion-reduce:animate-none",
    ],
    {
        variants: {
            /**
             * Superficie.
             *
             * `soft` es el aviso dentro de una pantalla: el fondo tintado y el
             * borde de la misma familia lo separan del contenido sin necesitar
             * sombra. `outline` es el de una notificación flotante, donde el
             * fondo blanco y el borde neutro lo despegan de lo que tape —sobre
             * una tabla de colores, un tinte suave se confunde con la fila que
             * hay debajo—.
             */
            variant: {
                soft: "",
                outline: "border-neutral-200 bg-white text-neutral-800",
            },

            /**
             * Tono. Se declara vacío porque el color lo aplican los
             * `compoundVariants` —solo tiñe en `soft`—, el medallón, la equis
             * y la barra.
             */
            tone: {
                info: "",
                success: "",
                warning: "",
                error: "",
                neutral: "",
            },

            /** Relleno, radio y separación, enteros de `SURFACE_SIZE`. */
            size: {
                sm: [
                    SURFACE_SIZE.md.paddingClass,
                    SURFACE_SIZE.md.radiusClass,
                    SPACING_CLASS.gap.md,
                ],
                md: [
                    SURFACE_SIZE.lg.paddingClass,
                    SURFACE_SIZE.lg.radiusClass,
                    SPACING_CLASS.gap.lg,
                ],
            },

            /**
             * Eje vertical de la fila.
             *
             * `center` mientras el aviso sea texto —es lo que mantiene el
             * medallón, el título y la equis en la misma línea óptica—;
             * `start` en cuanto hay acciones debajo.
             */
            align: {
                center: "items-center",
                start: "items-start",
            },
        },

        /*
         * Superficie tintada.
         *
         * El texto va en `-darker` y no en `-dark`, que es el tono con el que
         * se pintaría un rótulo: sobre el `-lighter` de su propia familia,
         * `-dark` se queda en 3,7:1 —el verde y el ámbar son los que peor
         * caen— y un párrafo necesita 4,5:1. En `-darker` la peor combinación
         * de las cinco da 6,9:1.
         *
         * Y no hay dos colores de texto: título y descripción comparten el
         * mismo y se distinguen por grosor. Bajarle la opacidad al párrafo
         * para "apagarlo" lo devolvería justo por debajo del umbral.
         *
         * El borde es el `-light` de la familia al 70%: a plena saturación el
         * ámbar y el cian dibujan un marco que pesa más que el propio texto, y
         * lo que tiene que hacer es cerrar la caja, no señalarla.
         */
        compoundVariants: [
            { variant: "soft", tone: "info", class: "border-info-light/70 bg-info-lighter text-info-darker" },
            { variant: "soft", tone: "success", class: "border-success-light/70 bg-success-lighter text-success-darker" },
            { variant: "soft", tone: "warning", class: "border-warning-light/70 bg-warning-lighter text-warning-darker" },
            { variant: "soft", tone: "error", class: "border-error-light/70 bg-error-lighter text-error-darker" },
            { variant: "soft", tone: "neutral", class: "border-neutral-300 bg-neutral-200 text-neutral-800" },
        ],

        defaultVariants: {
            variant: "soft",
            tone: "info",
            size: "md",
            align: "center",
        },
    }
);


/* -------------------------------------------------------------------------- */
/*  Medallón                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Medallón de tono.
 *
 * Es el icono del estado a tamaño de superficie —40px en `md`, 32px en `sm`—,
 * relleno con el `-light` de su familia y perfilado con el `-darker`. No hay
 * caja detrás: el propio glifo pone la forma, y así **cada tono trae la suya**
 * —círculo la confirmación, triángulo el aviso, octógono el error—. Eso es lo
 * que permite distinguirlos sin ver el color, que es lo que hace falta cuando
 * el rojo y el verde se leen igual.
 *
 * El tamaño sale de `CONTROL_SIZE`, no de `ICON_SIZE`: la escala de iconos
 * llega hasta 24px porque un icono acompaña a un texto, y esto no acompaña a
 * nada —es la pieza de color del aviso, del mismo tamaño que el medallón del
 * diálogo de confirmación, que también sale de la escala de controles—.
 *
 * Es una rejilla de una celda con los dos dibujos encima del otro: los dos
 * hijos van a `col-start-1 row-start-1` y se centran solos.
 */
export const alertMediaVariants = cva(["grid shrink-0 place-items-center"]);


/**
 * Capa de relleno del medallón — la silueta de color.
 *
 * Es el mismo icono con el trazo a cero, así que solo queda la forma maciza.
 * Y tiene que ser una capa aparte: lucide no garantiza que el contorno sea el
 * primer `path` del SVG —en `OctagonX` una de las aspas se dibuja antes que el
 * octógono—, así que un relleno aplicado al icono entero tapa el símbolo con
 * su propia forma. Partiéndolo en dos, el orden dentro de cada copia deja de
 * importar: abajo el color, arriba el dibujo completo.
 *
 * El relleno va por clase y no por prop porque lucide escribe `fill="none"`
 * como atributo de presentación, y una clase de CSS gana a un atributo.
 */
export const alertMediaShapeVariants = cva(["col-start-1 row-start-1"], {
    variants: {
        tone: {
            info: "fill-info-light",
            success: "fill-success-light",
            warning: "fill-warning-light",
            error: "fill-error-light",
            neutral: "fill-neutral-300",
        },
    },

    defaultVariants: { tone: "info" },
});


/**
 * Capa del dibujo — contorno y símbolo.
 *
 * En `-darker` sobre el `-light` de la silueta: es el único par de la familia
 * que aguanta el contraste de un glifo pequeño —`-dark` sobre `-light` se
 * queda en 2,9:1— y además es el mismo color del texto, así que el medallón y
 * el título se leen como una sola pieza.
 */
export const alertMediaGlyphVariants = cva(["col-start-1 row-start-1"], {
    variants: {
        tone: {
            info: "text-info-darker",
            success: "text-success-darker",
            warning: "text-warning-darker",
            error: "text-error-darker",
            neutral: "text-neutral-700",
        },
    },

    defaultVariants: { tone: "info" },
});


/* -------------------------------------------------------------------------- */
/*  Contenido                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Columna de textos.
 *
 * `min-w-0` es obligatorio: sin él, una palabra larga —una URL, un SKU— estira
 * el hijo flexible por encima del contenedor y la equis se sale de la caja.
 *
 * Sin separación entre título y descripción: con el título en `subtitle` y el
 * párrafo justo debajo, el interlineado de la rampa ya deja los 4px que hacen
 * falta, y cualquier `gap` encima parte el bloque en dos.
 */
export const alertContentVariants = cva(["flex min-w-0 flex-1 flex-col"]);


/** Título: qué ha pasado, en una línea. Hereda el color de la caja. */
export const alertTitleVariants = cva([], {
    variants: {
        size: {
            sm: TYPOGRAPHY.subtitleMd,
            md: TYPOGRAPHY.subtitleLg,
        },
    },

    defaultVariants: { size: "md" },
});


/**
 * Descripción: el detalle y, si lo hay, qué hacer ahora.
 *
 * Solo pone color en la variante blanca, donde el secundario es el gris de
 * siempre. En la tintada hereda el `-darker` de la caja a propósito: ver el
 * comentario de los `compoundVariants`.
 */
export const alertDescriptionVariants = cva([], {
    variants: {
        variant: {
            soft: "",
            outline: "text-neutral-600",
        },
        size: {
            sm: TYPOGRAPHY.bodySm,
            md: TYPOGRAPHY.bodyMd,
        },
    },

    defaultVariants: { variant: "soft", size: "md" },
});


/**
 * Fila de acciones.
 *
 * Vive dentro de la columna de texto y no en el pie de la caja: sangrada bajo
 * la descripción se lee como la respuesta a lo que acaba de decir el aviso.
 * `mt-2` la despega del párrafo sin abrir un escalón entero — es la misma
 * conversación, no otra sección.
 */
export const alertActionsVariants = cva([
    "mt-2 flex flex-wrap items-center",
    SPACING_CLASS.gap.sm,
]);


/* -------------------------------------------------------------------------- */
/*  Cierre                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Equis de cierre.
 *
 * Se pinta con el `cva` de GenericButton para no duplicar sus clases, pero
 * anula los colores: el `ghost` del sistema resuelve el hover con
 * `bg-neutral-200`, un gris opaco que sobre el tinte de un aviso de error
 * aparece como un parche. Un negro al 5% oscurece lo que tenga debajo sea cual
 * sea el tono, así que un solo hover sirve para los cinco.
 *
 * El glifo va en el `-dark` de la familia y no en el `-darker` del texto: la
 * equis es del aviso, no de la frase, y con el tono saturado se lee como parte
 * del mismo bloque de color que el medallón. La peor pareja de las cinco da
 * 3,7:1 sobre su fondo, por encima del 3:1 que pide un control.
 *
 * El botón mide 32px, así que en un aviso de una sola línea la caja crece unos
 * píxeles. Es el precio de un objetivo que se acierta con el dedo, y se paga:
 * la alternativa —una caja de 24px— deja de cumplir el mínimo táctil justo en
 * el único control que cierra el aviso.
 */
export const alertCloseVariants = cva(
    [
        "shrink-0 bg-transparent cursor-pointer",
    ],
    {
        variants: {
            tone: {
                info: "text-info-dark hover:text-info-darker",
                success: "text-success-dark hover:text-success-darker",
                warning: "text-warning-dark hover:text-warning-darker",
                error: "text-error-dark hover:text-error-darker",
                neutral: "text-neutral-600 hover:text-neutral-800",
            },
        },

        defaultVariants: { tone: "info" },
    }
);


/* -------------------------------------------------------------------------- */
/*  Cuenta atrás                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Barra de cuenta atrás.
 *
 * Solo aparece cuando el aviso se cierra solo, y ahí hace falta: sin ella, el
 * aviso desaparece sin explicación y quien estaba leyendo no sabe si se fue
 * solo o si lo cerró sin querer. Con ella, el tiempo que queda es visible
 * antes de que se acabe.
 *
 * La duración la pone el componente en `style` —es un número en tiempo de
 * ejecución— y `origin-left` fija el punto por el que se vacía. Con el puntero
 * encima, `data-paused` la congela en el fotograma actual a la vez que se para
 * el temporizador.
 *
 * `motion-reduce:hidden` en lugar de `animate-none`: una barra que no se mueve
 * es una barra llena, y eso dice justo lo contrario de lo que está pasando.
 * Quien pide menos movimiento se queda con el temporizador y con la equis.
 */
export const alertProgressVariants = cva(
    [
        "absolute inset-x-0 bottom-0 h-0.5 origin-left",
        "animate-countdown data-paused:animation-paused",
        "motion-reduce:hidden",
    ],
    {
        variants: {
            tone: {
                info: "bg-info-dark/30",
                success: "bg-success-dark/30",
                warning: "bg-warning-dark/30",
                error: "bg-error-dark/30",
                neutral: "bg-neutral-600/30",
            },
        },

        defaultVariants: { tone: "info" },
    }
);
