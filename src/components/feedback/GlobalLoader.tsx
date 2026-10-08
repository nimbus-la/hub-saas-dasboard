"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

import { useGlobalLoading } from "@/hooks";
import { CONTROL_SIZE, DURATION, ICON_STROKE } from "@/tokens";

import {
    globalLoaderBackdropVariants,
    globalLoaderCardVariants,
    globalLoaderMediaVariants,
    globalLoaderMessageVariants,
    globalLoaderSpinnerVariants,
    globalLoaderVariants,
} from "./global-loader.style";


/** framer-motion pide segundos; los tokens guardan milisegundos. */
const seconds = (ms: number) => ms / 1000;

const ENTER = { duration: seconds(DURATION.normal), ease: "easeOut" } as const;
const EXIT = { duration: seconds(DURATION.fast), ease: "easeIn" } as const;


/**
 * GlobalLoader
 *
 * La espera de cualquier mutación, dibujada una sola vez para toda la app.
 * Los botones ya no tienen que enseñar que están cargando: mientras el
 * servidor responde, la pantalla no acepta clics y, si tarda, aparece esta
 * tarjeta diciendo qué se está haciendo.
 *
 * Se monta una vez en el layout raíz. Qué mutación lo enciende y qué texto
 * pone se decide en su `meta`, ver `useGlobalLoading`.
 */
export default function GlobalLoader() {
    const { isBlocking, isVisible, message } = useGlobalLoading();
    const prefersReducedMotion = useReducedMotion();

    // Con movimiento reducido la tarjeta solo aparece; sin el pequeño zoom.
    const cardScale = prefersReducedMotion ? 1 : 0.96;

    return (
        <div aria-busy={isBlocking} className={globalLoaderVariants({ blocking: isBlocking })}>
            {/* Siempre montada para que el lector anuncie el texto al llegar. */}
            <span role="status" aria-live="polite" className="sr-only">
                {isVisible ? message : ""}
            </span>

            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        key="backdrop"
                        aria-hidden="true"
                        className={globalLoaderBackdropVariants()}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: ENTER }}
                        exit={{ opacity: 0, transition: EXIT }}
                    />
                )}

                {isVisible && (
                    <motion.div
                        key="card"
                        aria-hidden="true"
                        className={globalLoaderCardVariants()}
                        initial={{ opacity: 0, scale: cardScale }}
                        animate={{ opacity: 1, scale: 1, transition: ENTER }}
                        exit={{ opacity: 0, scale: cardScale, transition: EXIT }}
                    >
                        <div className={globalLoaderMediaVariants()}>
                            <LoaderCircle
                                size={CONTROL_SIZE["2xl"].iconSize}
                                strokeWidth={ICON_STROKE.regular}
                                className={globalLoaderSpinnerVariants()}
                            />
                        </div>

                        <p className={globalLoaderMessageVariants()}>{message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
