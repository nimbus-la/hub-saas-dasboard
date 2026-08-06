"use client";

// ── Sección del Sidebar (primer nivel) ──────────────────────────────────────
// Cabecera de sección plegable. El chevron está siempre visible —no sólo en
// hover— para que la capacidad de plegar sea descubrible; el hover sólo la
// refuerza con contraste y un desplazamiento sutil del texto.

import React from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { useSidebarLayout } from "@/context";
import type { SidebarGroupProps } from "@/interfaces";
import { DURATION, ICON_SIZE, ICON_STROKE } from "@/tokens";

import {
    sidebarGroupChevronVariants,
    sidebarGroupChevronWrapperVariants,
    sidebarGroupHeaderVariants,
    sidebarGroupLabelVariants,
    sidebarGroupListVariants,
    sidebarGroupRailSeparatorVariants,
} from "./sidebar-group.style";


const CHEVRON_SIZE = ICON_SIZE.sm;
/** Hueco entre el chevron y el título cuando éste corre en hover. */
const CHEVRON_GAP = 3;

/** framer-motion pide segundos; los tokens guardan milisegundos. */
const seconds = (ms: number) => ms / 1000;


export default function SidebarGroup({
    label,
    showRailSeparator = false,
    children,
}: SidebarGroupProps) {
    const { isRail } = useSidebarLayout();
    const prefersReducedMotion = useReducedMotion();

    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const listId = React.useId();

    // ── Modo riel: sin cabecera, sólo iconos ─────────────────────────────────
    if (isRail) {
        return (
            <div>
                {showRailSeparator && (
                    <div
                        aria-hidden="true"
                        className={sidebarGroupRailSeparatorVariants()}
                    />
                )}

                <ul aria-label={label} className={sidebarGroupListVariants()}>
                    {children}
                </ul>
            </div>
        );
    };

    return (
        <div>
            <motion.button
                type="button"
                onClick={() => setIsOpen((prev: boolean) => !prev)}
                aria-expanded={isOpen}
                aria-controls={listId}
                initial="rest"
                whileHover="hover"
                // Mismo reveal con foco de teclado: el chevron oculto sólo en
                // hover dejaría al usuario de teclado sin la pista de plegado.
                whileFocus="hover"
                animate="rest"
                className={sidebarGroupHeaderVariants()}
            >
                {/* Flecha — fuera del flujo: en reposo no reserva espacio, así el
                    título arranca alineado con las etiquetas de segundo nivel. */}
                <motion.span
                    aria-hidden="true"
                    variants={{
                        rest: {
                            opacity: 0,
                            x: -4,
                            transition: {
                                duration: seconds(DURATION.instant),
                            },
                        },
                        hover: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                // Espera a que el texto empiece a moverse
                                delay: seconds(DURATION.instant) * 0.8,
                                duration: seconds(DURATION.normal),
                            },
                        }
                    }}
                    transition={{ duration: seconds(DURATION.slow) }}
                    className={sidebarGroupChevronWrapperVariants()}
                >
                    <ChevronRight
                        size={CHEVRON_SIZE}
                        strokeWidth={ICON_STROKE.bold}
                        className={sidebarGroupChevronVariants({ open: isOpen })}
                    />
                </motion.span>

                {/* Texto — corre a la derecha para hacerle sitio al chevron */}
                <motion.span
                    variants={{
                        rest: { x: 0 },
                        hover: { x: prefersReducedMotion ? 0 : CHEVRON_SIZE + CHEVRON_GAP }
                    }}
                    transition={{ duration: seconds(DURATION.normal), ease: "easeOut" }}
                    className={sidebarGroupLabelVariants()}
                >
                    {label}
                </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        id={listId}
                        key="section"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={
                            prefersReducedMotion
                                ? { duration: 0 }
                                : { duration: seconds(DURATION.normal), ease: [0.16, 1, 0.3, 1] }
                        }
                        className="overflow-hidden"
                    >
                        <ul className={sidebarGroupListVariants()}>{children}</ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
