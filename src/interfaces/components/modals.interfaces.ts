import type { ReactNode, RefObject } from "react";

import type { VariantProps } from "class-variance-authority";

import type { modalPopupVariants } from "@/components/modals/modal.style";


/** Ancho del panel. Se deriva de las variantes para no mantener dos listas. */
export type ModalSize = NonNullable<
    VariantProps<typeof modalPopupVariants>["size"]
>;


export interface ModalProps {
    /** Estado del diálogo. Siempre controlado: quien lo abre sabe por qué. */
    open: boolean;
    onOpenChange: (open: boolean) => void;

    /** Título del diálogo. Es lo primero que anuncia un lector de pantalla. */
    title: string;
    /**
     * Bajada bajo el título.
     *
     * Dice qué se va a hacer o qué consecuencia tiene aceptar. Conviene que
     * sea concreta: es la segunda cosa que se anuncia al abrir.
     */
    description?: string;

    size?: ModalSize;

    /**
     * Elemento que recibe el foco al abrir.
     *
     * Sin él, Base UI enfoca el primer elemento tabulable, que en un diálogo
     * con botón de cerrar es la equis: quien navega con teclado empieza por la
     * salida en lugar de por el primer campo.
     */
    initialFocus?: RefObject<HTMLElement | null>;

    /**
     * Etiqueta accesible del botón de cerrar.
     *
     * Por defecto "Cerrar"; nombrar el diálogo ayuda cuando hay más de uno
     * montado a la vez.
     */
    closeLabel?: string;

    /**
     * ¿Bloquear el cierre por clic fuera?
     *
     * Para diálogos con cambios sin guardar, donde un clic despistado tira el
     * trabajo. `Escape`, la equis y el botón del pie siguen cerrando: quitar
     * también esas tres dejaría el diálogo sin salida por teclado.
     */
    disableDismiss?: boolean;

    children?: ReactNode;
    /**
     * Clases del panel.
     *
     * Admite `undefined` explícito porque quien envuelve al Modal —el diálogo
     * de confirmación, sin ir más lejos— reenvía su propio `className` tal
     * cual, y con `exactOptionalPropertyTypes` "ausente" y "undefined" no son
     * lo mismo.
     */
    className?: string | undefined;
}


/** Diálogo de confirmación de una acción sin vuelta atrás. */
export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    title: string;
    /** Qué se va a borrar y qué se pierde con ello. */
    description: string;

    /** Texto del botón que ejecuta la acción. Un verbo, no "Aceptar". */
    confirmLabel: string;
    cancelLabel?: string;

    onConfirm: () => void;

    /**
     * Tono de la acción.
     *
     * `danger` para lo irreversible —borrar, revocar—; `primary` para
     * confirmaciones que solo piden una segunda lectura.
     */
    tone?: "danger" | "primary";

    /** Bloquea los botones mientras la acción está en vuelo. */
    loading?: boolean;

    className?: string;
}
