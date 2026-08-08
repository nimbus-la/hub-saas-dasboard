"use client";

import { Dialog } from "@base-ui/react/dialog";

import type { ModalProps } from "@/interfaces";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";
import { CONTROL_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import {
    modalBackdropVariants,
    modalBodyVariants,
    modalCloseVariants,
    modalDescriptionVariants,
    modalFooterVariants,
    modalHeaderVariants,
    modalHeadingVariants,
    modalPopupVariants,
    modalTitleVariants,
} from "./modal.style";


/**
 * Modal
 *
 * Diálogo genérico del panel: cabecera con título y bajada, cuerpo libre y pie
 * de acciones opcional. Envoltorio de Base UI —el foco atrapado, el bloqueo
 * del scroll, `Escape` y el `aria-labelledby` son suyos—; aquí solo se decide
 * la estructura y se enchufan los estilos del sistema.
 *
 * Siempre controlado: quien lo abre sabe por qué, y así el estado del diálogo
 * vive junto al dato que va a tocar en vez de repartido entre los dos.
 *
 * Para confirmar una acción irreversible no se usa este componente sino
 * `ConfirmDialog`, que se monta sobre el primitivo de alerta: ese no se cierra
 * con un clic fuera, que es justo la diferencia que importa cuando lo que hay
 * detrás es un borrado.
 */
export default function Modal({
    open,
    onOpenChange,
    title,
    description,
    size,
    initialFocus,
    closeLabel = messages.components.modal.close,
    disableDismiss = false,
    footer,
    children,
    className,
}: ModalProps) {
    return (
        <Dialog.Root
            open={open}
            onOpenChange={onOpenChange}
            disablePointerDismissal={disableDismiss}
        >
            <Dialog.Portal>
                <Dialog.Backdrop className={modalBackdropVariants()} />

                <Dialog.Popup
                    initialFocus={initialFocus}
                    className={cn(modalPopupVariants({ size }), className)}
                >
                    {/* ── Cabecera ─────────────────────────────────────────── */}
                    <div className={modalHeaderVariants()}>
                        <div className={modalHeadingVariants()}>
                            <Dialog.Title className={modalTitleVariants()}>
                                {title}
                            </Dialog.Title>

                            {description && (
                                <Dialog.Description
                                    className={modalDescriptionVariants()}
                                >
                                    {description}
                                </Dialog.Description>
                            )}
                        </div>

                        {/* La equis se queda siempre, incluso con el cierre por
                            clic fuera desactivado: es la única salida visible
                            para quien no sabe que `Escape` cierra. */}
                        <Dialog.Close
                            aria-label={closeLabel}
                            className={modalCloseVariants()}
                        >
                            <ICON_TOKENS.CLOSE
                                size={CONTROL_SIZE.sm.iconSize}
                                strokeWidth={ICON_STROKE_BY_SIZE.sm}
                                aria-hidden="true"
                            />
                        </Dialog.Close>
                    </div>

                    {/* ── Cuerpo ───────────────────────────────────────────── */}
                    {children && (
                        <div className={modalBodyVariants()}>{children}</div>
                    )}

                    {/* ── Pie ──────────────────────────────────────────────── */}
                    {footer && (
                        <div className={modalFooterVariants()}>{footer}</div>
                    )}
                </Dialog.Popup>
            </Dialog.Portal>
        </Dialog.Root>
    );
};
