import type { AlertProps } from "@/interfaces";
import { ICON_SIZE, ICON_STROKE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";
import { ASSERTIVE_TONES, DEFAULT_ICON, MEDIA_SIZE } from "@/utils";
import { messages } from "@/messages";
import { cn } from "@/lib/utils";

import {
    alertActionsVariants,
    alertCloseVariants,
    alertContentVariants,
    alertDescriptionVariants,
    alertMediaGlyphVariants,
    alertMediaShapeVariants,
    alertMediaVariants,
    alertProgressVariants,
    alertTitleVariants,
    alertVariants,
} from "./alert.style";



/**
 * Alert
 *
 * El aviso del panel: icono de tono, título, descripción, acciones y la equis
 * para cerrarlo. Sirve dentro de una pantalla —un formulario que no se pudo
 * guardar— y también flotando como notificación, cambiando `variant` a
 * `outline`.
 *
 * **No tiene ciclo de vida.** No cuenta el tiempo, no se pausa y no se
 * desmonta: pinta lo que le dan y avisa por `onClose` cuando alguien pulsa la
 * equis. Quien lo monta es quien lo retira.
 *
 * Ese reparto es deliberado. En un aviso flotante el tiempo lo lleva sonner
 * —que además pausa al pasar el ratón, apila, deja descartar deslizando y lo
 * anuncia al lector de pantalla—, y duplicar aquí ese temporizador significaba
 * dos relojes compitiendo por cerrar la misma caja. Dentro de una pantalla,
 * sencillamente no hace falta: el error de un formulario no debe caducar.
 *
 * Lo único que queda del tiempo es la barra de `countdownMs`, y es sólo un
 * dibujo: le pone cara a la cuenta que lleva otro, porque un aviso que
 * desaparece sin previo aviso deja a quien lo estaba leyendo sin saber si se
 * fue solo o lo cerró sin querer.
 *
 * Al no tener estado tampoco es un componente de cliente: dentro de una
 * pantalla servida desde el servidor se pinta ahí, sin mandar nada al
 * navegador. La directiva `"use client"` la pone quien le da comportamiento
 * —`AlertToaster`, o la pantalla que le pasa un `onClose`—.
 *
 * Uso mínimo:
 *   <Alert tone="success" title="Categoría creada" />
 *
 * Para un aviso flotante no se usa directamente: `notify.success(…)`.
 */
export default function Alert({
    title,
    description,
    tone = "info",
    variant = "soft",
    size = "md",
    icon,
    showIcon = true,
    actions,
    countdownMs = null,
    dismissible = true,
    closeLabel = messages.components.alert.close,
    announce = true,
    onClose,
    className,
}: AlertProps) {
    const Icon = icon ?? DEFAULT_ICON[tone];

    // La barra sólo tiene sentido con una cuenta atrás de verdad detrás: a cero
    // o en negativo se pintaría vacía desde el primer fotograma, que es decir
    // "esto ya se fue" de algo que sigue en pantalla.
    const showCountdown = countdownMs !== null && countdownMs > 0;

    return (
        <div
            role={
                announce
                    ? ASSERTIVE_TONES.includes(tone)
                        ? "alert"
                        : "status"
                    : undefined
            }
            className={cn(
                alertVariants({
                    variant,
                    tone,
                    size,
                    // Con acciones debajo, el medallón sube al principio del
                    // bloque: centrado contra tres líneas más dos botones deja
                    // de señalar al título.
                    align: actions ? "start" : "center",
                }),
                className
            )}
        >
            {showIcon && (
                <span aria-hidden="true" className={alertMediaVariants()}>
                    {/* Silueta de color. Sin trazo: solo la forma. */}
                    <Icon
                        size={MEDIA_SIZE[size]}
                        strokeWidth={0}
                        className={alertMediaShapeVariants({ tone })}
                    />

                    {/* Contorno y símbolo, encima. Trazo fino: a 40px el
                        grosor por defecto de lucide convierte el contorno en
                        un marco y le come el sitio al símbolo. */}
                    <Icon
                        size={MEDIA_SIZE[size]}
                        strokeWidth={ICON_STROKE.light}
                        className={alertMediaGlyphVariants({ tone })}
                    />
                </span>
            )}

            <div className={alertContentVariants()}>
                <p className={alertTitleVariants({ size })}>{title}</p>

                {description && (
                    <div className={alertDescriptionVariants({ variant, size })}>
                        {description}
                    </div>
                )}

                {actions && <div className={alertActionsVariants()}>{actions}</div>}
            </div>

            {dismissible && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label={closeLabel}
                    className={alertCloseVariants({ tone })}
                >
                    <ICON_TOKENS.CLOSE
                        size={ICON_SIZE.xl}
                        strokeWidth={ICON_STROKE_BY_SIZE.xl}
                        aria-hidden="true"
                    />
                </button>
            )}

            {showCountdown && (
                <span
                    aria-hidden="true"
                    // La duración es un número en tiempo de ejecución: no hay
                    // clase que la exprese. Es la excepción documentada en el
                    // `@theme` de `--animate-countdown`.
                    style={{ animationDuration: `${countdownMs}ms` }}
                    className={alertProgressVariants({ tone })}
                />
            )}
        </div>
    );
};
