"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";

import GenericButton from "@/components/buttons/GenericButton";
import type { ConfirmDialogProps, ConfirmDialogTone } from "@/interfaces";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";
import { CONTROL_SIZE, ICON_STROKE, ICON_TOKENS } from "@/tokens";

import {
    confirmDialogActionVariants,
    confirmDialogBackdropVariants,
    confirmDialogBodyVariants,
    confirmDialogDescriptionVariants,
    confirmDialogFooterVariants,
    confirmDialogHeadingVariants,
    confirmDialogMediaVariants,
    confirmDialogPopupVariants,
    confirmDialogTitleVariants,
} from "./confirm-dialog.style";


/**
 * Icono por defecto de cada tono.
 *
 * `danger` es el tono del borrado, así que su glifo es el mismo cubo que abre
 * la acción en la tabla: quien pulsó la papelera vuelve a verla en el diálogo y
 * sabe sin leer que está en el sitio correcto. `primary` avisa de algo que
 * conviene releer, no de una destrucción, y ahí el triángulo dice justo eso.
 *
 * Cualquiera de los dos se sustituye con la prop `icon` cuando la acción tiene
 * un glifo más concreto —revocar un acceso, vaciar un carrito—.
 */
const DEFAULT_ICON = {
    danger: ICON_TOKENS.DELETE,
    primary: ICON_TOKENS.WARNING,
} as const satisfies Record<ConfirmDialogTone, unknown>;


/** Botón que ejecuta la acción, por tono. Ver `generic-button.style.ts`. */
const CONFIRM_VARIANT = {
    danger: "destructive",
    primary: "primary",
} as const satisfies Record<ConfirmDialogTone, string>;


/**
 * ConfirmDialog
 *
 * La segunda pregunta antes de una acción sin vuelta atrás: eliminar una
 * categoría, revocar un acceso, descartar un formulario a medias. Icono, título
 * y descripción llegan por props; la estructura —medallón, pregunta, línea, y
 * el pie con "Cancelar" y la acción— es fija, y ese es el punto: una
 * confirmación se reconoce por su forma antes de leerla.
 *
 * Se monta sobre el primitivo de **alerta** de Base UI, no sobre el de diálogo,
 * y la diferencia no es cosmética: la alerta no se cierra al pulsar fuera. Un
 * clic despistado no puede ser la respuesta a "¿seguro que quieres borrar
 * esto?" — pero `Escape` y "Cancelar" siguen cerrando, porque un diálogo sin
 * salida por teclado es una trampa.
 *
 * `onConfirm` no cierra el diálogo: lo hace quien lo usa cuando la acción
 * termina. Cerrar aquí obligaría a elegir entre mentir —dar por hecho el
 * borrado antes de que el servidor conteste— o dejar el `loading` sin sitio
 * donde verse.
 */
export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmLabel,
    cancelLabel = messages.components.confirmDialog.cancel,
    onConfirm,
    icon,
    tone = "danger",
    loading = false,
    className,
}: ConfirmDialogProps) {
    const Icon = icon ?? DEFAULT_ICON[tone];

    return (
        <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
            <AlertDialog.Portal>
                <AlertDialog.Backdrop
                    className={confirmDialogBackdropVariants()}
                />

                <AlertDialog.Popup
                    className={cn(confirmDialogPopupVariants(), className)}
                >
                    {/* ── La pregunta: medallón + textos ───────────────────── */}
                    <div className={confirmDialogBodyVariants()}>
                        <div className={confirmDialogMediaVariants({ tone })}>
                            <Icon
                                size={CONTROL_SIZE["2xl"].iconSize}
                                strokeWidth={ICON_STROKE.regular}
                                aria-hidden="true"
                            />
                        </div>

                        <div className={confirmDialogHeadingVariants()}>
                            <AlertDialog.Title
                                className={confirmDialogTitleVariants()}
                            >
                                {title}
                            </AlertDialog.Title>

                            <AlertDialog.Description
                                className={confirmDialogDescriptionVariants()}
                            >
                                {description}
                            </AlertDialog.Description>
                        </div>
                    </div>

                    {/* ── Acciones ─────────────────────────────────────────── */}
                    <div className={confirmDialogFooterVariants()}>
                        <AlertDialog.Close
                            disabled={loading}
                            render={
                                <GenericButton
                                    variant="ghost"
                                    label={cancelLabel}
                                    className={confirmDialogActionVariants({
                                        role: "cancel",
                                    })}
                                />
                            }
                        />

                        <GenericButton
                            variant={CONFIRM_VARIANT[tone]}
                            label={confirmLabel}
                            onClick={onConfirm}
                            disabled={loading}
                            className={confirmDialogActionVariants({
                                role: "confirm",
                            })}
                        />
                    </div>
                </AlertDialog.Popup>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    );
};
