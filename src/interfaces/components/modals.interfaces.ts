import type { ReactNode, RefObject } from "react";

import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import type { confirmDialogMediaVariants } from "@/components/modals/confirm-dialog.style";
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
     * Acciones del pie.
     *
     * Van aparte de `children` porque el pie tiene geometría propia —se apila
     * en móvil con la acción principal arriba— y no es algo que deba rehacer
     * cada pantalla. Sin esta prop no se pinta el bloque: un diálogo puede no
     * tener más salida que la equis.
     */
    footer?: ReactNode;

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


/**
 * Tono de una confirmación.
 *
 * Se deriva de las variantes del medallón para no mantener dos listas: el día
 * que entre un tercer tono, este tipo se entera solo.
 */
export type ConfirmDialogTone = NonNullable<
    VariantProps<typeof confirmDialogMediaVariants>["tone"]
>;


/** Diálogo de confirmación de una acción sin vuelta atrás. */
export interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    /** La pregunta, en una línea: "Eliminar categoría". */
    title: string;
    /** Qué se va a borrar y qué se pierde con ello. */
    description: string;

    /** Texto del botón que ejecuta la acción. Un verbo, no "Aceptar". */
    confirmLabel: string;
    cancelLabel?: string;

    /**
     * Ejecuta la acción. **No cierra el diálogo**: eso lo hace quien lo usa
     * cuando la operación termina, que es lo único que permite mostrar el
     * `loading` mientras tanto.
     */
    onConfirm: () => void;

    /**
     * Icono del medallón.
     *
     * Sale de `ICON_TOKENS`, no de lucide directamente: el glifo que representa
     * "eliminar" es una decisión de producto y vive en el registro. Si no se
     * pasa, cada tono usa el suyo —papelera en `danger`, triángulo en
     * `primary`—, así que el caso de borrado ya viene resuelto.
     */
    icon?: LucideIcon;

    /**
     * Tono de la acción.
     *
     * `danger` para lo irreversible —borrar, revocar—; `primary` para
     * confirmaciones que solo piden una segunda lectura.
     */
    tone?: ConfirmDialogTone;

    /** Bloquea los botones mientras la acción está en vuelo. */
    loading?: boolean;

    className?: string;
}
