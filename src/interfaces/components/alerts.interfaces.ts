import type { ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

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
     * cosa, donde el fondo blanco evita que se confunda con lo que tapa.
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
     * —sangradas bajo el texto— y porque un aviso que se cierra solo necesita
     * saber que las tiene: mientras el puntero o el foco están encima, el
     * temporizador se para para que dé tiempo a pulsarlas.
     */
    actions?: ReactNode;

    /**
     * Cuánto dura el aviso en pantalla, en milisegundos.
     *
     * Por defecto `ALERT_DURATION` (5s). `null` lo deja hasta que alguien lo
     * cierre: es lo que hay que usar cuando el aviso explica un error del que
     * el usuario tiene que hacerse cargo, porque un mensaje que se va solo
     * antes de leerse no ha avisado de nada.
     */
    duration?: number | null;

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
     * ¿Parar el temporizador con el puntero encima?
     *
     * El foco lo para siempre, aunque esto sea `false`: si alguien llegó con
     * el tabulador hasta una acción del aviso, el aviso no puede irse debajo
     * de su dedo.
     */
    pauseOnHover?: boolean;

    /** ¿Pintar la barra de cuenta atrás? Solo se ve si el aviso se cierra solo. */
    showProgress?: boolean;

    /**
     * Se llama cuando el aviso termina de cerrarse —por la equis o por
     * temporizador—, ya con la animación de salida hecha.
     *
     * El aviso se desmonta solo, así que esta prop no hace falta para que
     * desaparezca: es para que quien lo mostró lo saque de su lista o libere
     * lo que estuviera reservando.
     */
    onClose?: () => void;

    className?: string;
}
