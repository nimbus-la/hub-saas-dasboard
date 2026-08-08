"use client";

import * as React from "react";

import type { AlertProps } from "@/interfaces";
import { DURATION, ICON_SIZE, ICON_STROKE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";
import { ALERT_DURATION, ASSERTIVE_TONES, DEFAULT_ICON, MEDIA_SIZE } from "@/utils";
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
 * guardar, un listado que se quedó sin conexión— y también flotando como
 * notificación, cambiando `variant` a `outline`.
 *
 * Se cierra solo a los cinco segundos (`ALERT_DURATION`). El temporizador se
 * para mientras el puntero o el foco están encima y sigue por donde iba al
 * salir: si alguien se detuvo a leerlo, el aviso no se le va de debajo del
 * cursor, y si el aviso trae acciones, dan tiempo a pulsarse. Para los avisos
 * de los que el usuario tiene que hacerse cargo —un error de verdad— va
 * `duration={null}`, y entonces solo lo cierra la equis.
 *
 * El componente se desmonta solo al cerrarse; `onClose` es para que quien lo
 * mostró se entere, no para que desaparezca. Si se muestra desde una lista,
 * hay que darle `key`: sin ella React reutiliza la instancia cerrada y el
 * segundo aviso no llega a verse.
 *
 * Uso mínimo:
 *   <Alert tone="success" title="Categoría creada" />
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
    duration = ALERT_DURATION,
    dismissible = true,
    closeLabel = "Cerrar aviso",
    pauseOnHover = true,
    showProgress = true,
    onClose,
    className,
}: AlertProps) {
    const Icon = icon ?? DEFAULT_ICON[tone];

    const [phase, setPhase] = React.useState<"open" | "closing" | "closed">("open");
    const [paused, setPaused] = React.useState(false);

    /**
     * Lo que le queda al temporizador.
     * 
     * Va en una `ref` y no en estado porque cambia en la limpieza del efecto y
     * nadie lo pinta: la barra de cuenta atrás la anima el CSS, que se congela
     * con `data-paused` en el mismo momento. Guardar el resto es lo que hace
     * que pausar sea pausar y no reiniciar — si al salir el puntero volviera a
     * empezar por los cinco segundos, un aviso al que se pasa por encima dos
     * veces no se iría nunca.
     */
    const remainingRef = React.useRef(duration ?? 0);

    React.useEffect(() => {
        remainingRef.current = duration ?? 0;
    }, [duration]);

    const close = React.useCallback(() => {
        setPhase((current) => (current === "open" ? "closing" : current));
    }, []);


    /**
     * Temporizador
     * Se rearma en cada pausa con el tiempo que quedaba. La limpieza descuenta
     * lo consumido, así que el efecto es reentrante por construcción.
     */
    React.useEffect(() => {
        if (duration === null || phase !== "open" || paused) return;

        const startedAt = Date.now();
        const timer = window.setTimeout(close, remainingRef.current);

        return () => {
            window.clearTimeout(timer);
            remainingRef.current = Math.max(
                0,
                remainingRef.current - (Date.now() - startedAt)
            );
        };
    }, [close, duration, paused, phase]);

    /**
     * Salida
     * El desmontaje espera a que termine la animación; `onClose` se avisa una
     * vez el aviso ya no está en pantalla, que es cuando de verdad se fue.
     */
    React.useEffect(() => {
        if (phase !== "closing") return;

        const timer = window.setTimeout(() => {
            setPhase("closed");
            onClose?.();
        }, DURATION.fast);

        return () => window.clearTimeout(timer);
    }, [onClose, phase]);

    if (phase === "closed") return null;

    const autoDismiss = duration !== null;
    const showCountdown = autoDismiss && showProgress && phase === "open";

    return (
        <div
            role={ASSERTIVE_TONES.includes(tone) ? "alert" : "status"}
            data-closing={phase === "closing" ? "" : undefined}
            onMouseEnter={pauseOnHover ? () => setPaused(true) : undefined}
            onMouseLeave={pauseOnHover ? () => setPaused(false) : undefined}
            // El foco para el temporizador siempre: quien llegó hasta aquí con
            // el tabulador está usando el aviso, y `onFocus`/`onBlur` en React
            // burbujean desde las acciones y desde la equis.
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
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
                    onClick={close}
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
                    data-paused={paused ? "" : undefined}
                    // La duración es un número en tiempo de ejecución: no hay
                    // clase que la exprese. Es la excepción documentada en el
                    // `@theme` de `--animate-countdown`.
                    style={{ animationDuration: `${duration}ms` }}
                    className={alertProgressVariants({ tone })}
                />
            )}
        </div>
    );
};
