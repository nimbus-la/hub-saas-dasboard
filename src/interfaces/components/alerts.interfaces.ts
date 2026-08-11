import type { ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import type { ToasterProps } from "sonner";

import type { alertVariants } from "@/components/alerts/alert.style";


/**
 * Significado del aviso.
 *
 * Se deriva de las variantes para no mantener dos listas: el día que entre un
 * sexto tono, este tipo se entera solo.
 */
export type AlertTone = NonNullable<VariantProps<typeof alertVariants>["tone"]>;


/** Superficie del aviso: tintada (`soft`) o blanca con borde (`outline`). */
export type AlertVariant = NonNullable<
    VariantProps<typeof alertVariants>["variant"]
>;


/**
 * Escalón del aviso.
 *
 * Solo `sm` y `md`. Un aviso no es un control: no tiene que casar en alto con
 * el botón de al lado, y por encima de `md` deja de ser un apunte al margen
 * para convertirse en el contenido de la pantalla —para eso está el estado
 * vacío—.
 */
export type AlertSize = NonNullable<VariantProps<typeof alertVariants>["size"]>;


export interface AlertProps {
    /** Qué ha pasado, en una línea: "No se pudo guardar la categoría". */
    title: string;

    /**
     * El detalle y, si lo hay, qué hacer ahora.
     *
     * Admite nodos y no solo texto para poder meter un enlace a la ayuda o
     * resaltar un dato dentro de la frase.
     */
    description?: ReactNode;

    /** Qué significa el aviso. Decide color e icono por defecto. */
    tone?: AlertTone;

    /**
     * Superficie.
     *
     * `soft` para un aviso dentro de la pantalla —el tinte lo separa del
     * contenido sin sombra—; `outline` para el que flota por encima de otra
     * cosa, donde el fondo blanco y la sombra evitan que se confunda con lo
     * que tapa. Es la que usa `notify`.
     */
    variant?: AlertVariant;

    size?: AlertSize;

    /**
     * Icono de la izquierda.
     *
     * Sale de `ICON_TOKENS`, no de lucide directamente. Si no se pasa, cada
     * tono usa el suyo, así que el caso normal ya viene resuelto; se sustituye
     * cuando el aviso habla de algo concreto —un pago rechazado, un archivo
     * que no subió—.
     */
    icon?: LucideIcon;

    /**
     * ¿Pintar icono?
     *
     * `false` deja el aviso solo con texto. Es una excepción, no un ajuste de
     * gusto: el icono es lo que permite distinguir un error de una
     * confirmación sin depender del color, que es lo único que ve quien no
     * distingue el rojo del verde.
     */
    showIcon?: boolean;

    /**
     * Acciones del aviso: "Reintentar", "Deshacer", "Ver detalle".
     *
     * Van por props y no dentro de la descripción porque tienen sitio propio
     * —sangradas bajo el texto— y porque cambian la alineación del medallón,
     * que con dos botones debajo deja de estar centrado.
     *
     * En un aviso flotante dan tiempo a pulsarse: sonner para su temporizador
     * mientras el puntero está sobre la pila.
     */
    actions?: ReactNode;

    /**
     * Cuánto va a durar el aviso en pantalla, en milisegundos, **para pintar
     * la barra**.
     *
     * No es un temporizador: el aviso no se cierra al llegar a cero. Es el
     * número que necesita la animación de la barra para vaciarse al mismo
     * ritmo que la cuenta que lleva otro —sonner—, y por eso quien pasa la
     * duración a `notify` es quien pasa este mismo valor aquí.
     *
     * `null` —lo normal dentro de una pantalla— no pinta barra: un aviso que
     * no caduca no tiene nada que contar hacia atrás.
     */
    countdownMs?: number | null;

    /** ¿Mostrar la equis de cierre? */
    dismissible?: boolean;

    /**
     * Etiqueta accesible de la equis.
     *
     * Por defecto "Cerrar aviso"; nombrar el aviso ayuda cuando hay varios
     * apilados a la vez.
     */
    closeLabel?: string;

    /**
     * ¿Anunciarlo al lector de pantalla?
     *
     * Por defecto sí: el aviso se pinta con `role="alert"` o `role="status"`
     * según el tono, que es lo que hace que se lea sin que nadie mueva el
     * foco hasta él.
     *
     * Va a `false` cuando el aviso ya nace dentro de una región viva ajena
     * —la pila de sonner es un `aria-live`—, porque una región dentro de otra
     * hace que el mismo texto se anuncie dos veces.
     */
    announce?: boolean;

    /**
     * Se llama cuando alguien pulsa la equis.
     *
     * El aviso no se desmonta solo: quien lo monta es quien lo retira. Dentro
     * de una pantalla eso significa borrar el estado que lo pintaba; en un
     * aviso flotante lo resuelve `notify`, que aquí cuelga el `dismiss` de
     * sonner.
     */
    onClose?: () => void;

    className?: string;
}


/**
 * Ajustes de un aviso flotante — lo que se le pasa a `notify.success(…)`.
 *
 * Es el `AlertProps` sin lo que decide el propio `notify`: el tono lo pone el
 * método que se llama, la superficie es siempre `outline` y la barra de cuenta
 * atrás sale de `duration`, para no poder escribir un aviso cuya barra dure
 * menos que él.
 */
export interface NotifyOptions
    extends Pick<
        AlertProps,
        | "description"
        | "actions"
        | "icon"
        | "showIcon"
        | "size"
        | "dismissible"
        | "closeLabel"
        | "className"
    > {
    /**
     * Cuánto dura en pantalla, en milisegundos.
     *
     * Por defecto `ALERT_DURATION` (5s). `null` lo deja hasta que alguien lo
     * cierre: es lo que hay que usar cuando el aviso explica un error del que
     * el usuario tiene que hacerse cargo, porque un mensaje que se va solo
     * antes de leerse no ha avisado de nada.
     */
    duration?: number | null;

    /**
     * Identificador del aviso.
     *
     * Repetirlo actualiza el que ya está en pantalla en vez de apilar otro
     * igual: es lo que evita seis "Sin conexión" seguidos cuando lo que falla
     * es la red y no una acción del usuario.
     */
    id?: string | number;

    /** Se llama cuando el aviso se va, lo cierre la equis o el temporizador. */
    onClose?: () => void;
}


/**
 * Ajustes del contenedor de avisos flotantes.
 *
 * Sólo lo que una aplicación cambia de verdad. Lo demás —el tiempo, el ancho,
 * la forma de cada aviso— lo fija `AlertToaster`, que para eso es la decisión
 * del design system y no de la pantalla que lo monta.
 */
export type AlertToasterProps = Pick<
    ToasterProps,
    "position" | "expand" | "visibleToasts" | "offset" | "className"
>;
