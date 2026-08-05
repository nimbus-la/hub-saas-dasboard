"use client";

// ── Sección del Sidebar (primer nivel) ──────────────────────────────────────
// Cabecera de sección plegable. El chevron está siempre visible —no sólo en
// hover— para que la capacidad de plegar sea descubrible; el hover sólo la
// refuerza con contraste y un desplazamiento sutil del texto.

import React from "react";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "lucide-react";

import { useSidebarLayout } from "@/context";


// El título arranca a 42px — la misma sangría que las etiquetas de segundo
// nivel en SidebarButton (px-3 + icono de 18 + gap-3). Si cambia una, cambia la
// otra: es la clase `pl-[42px]` de abajo, literal para que Tailwind la extraiga.
const CHEVRON_SIZE = 14;
/** Hueco entre el chevron y el título cuando éste corre en hover. */
const CHEVRON_GAP = 3;

interface SidebarGroupProps {
    label: string;
    /** En modo riel sustituye el título por un separador (salvo la 1ª sección). */
    showRailSeparator?: boolean;
    children: React.ReactNode;
};

export default function SidebarGroup({ label, showRailSeparator = false, children }: SidebarGroupProps) {
    const { isRail } = useSidebarLayout();
    const prefersReducedMotion = useReducedMotion();

    const [isOpen, setIsOpen] = React.useState<boolean>(true);
    const listId = React.useId();

    // ── Modo riel: sin cabecera, sólo iconos ─────────────────────────────────
    if (isRail) {
        return (
            <div>
                {showRailSeparator && (
                    <div aria-hidden="true" className="mx-auto mb-3 h-px w-8 rounded-full bg-neutral-300" />
                )}

                <ul aria-label={label} className="space-y-1">
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
                className="group relative flex w-full cursor-pointer items-center rounded-lg py-1.5 px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-main/30"
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
                                duration: 0.12,
                            },
                        },
                        hover: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                delay: 0.08, // Espera a que el texto empiece a moverse
                                duration: 0.18,
                            },
                        }
                    }}
                    transition={{ duration: 0.35 }}
                    className="absolute left-3 flex items-center"
                >
                    <ChevronRight
                        size={CHEVRON_SIZE}
                        strokeWidth={3}
                        className={`text-neutral-400 transition-[transform,color] duration-200 ease-out group-hover:text-neutral-800 motion-reduce:transition-none ${isOpen ? "rotate-90" : "rotate-0"}`}
                    />
                </motion.span>

                {/* Texto — corre a la derecha para hacerle sitio al chevron */}
                <motion.span
                    variants={{ 
                        rest: { x: 0 }, 
                        hover: { x: prefersReducedMotion ? 0 : CHEVRON_SIZE + CHEVRON_GAP } 
                    }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="truncate text-[11px] font-bold uppercase tracking-wide text-neutral-500 group-hover:text-neutral-800"
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
                                : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }
                        }
                        className="overflow-hidden"
                    >
                        <ul className="space-y-1">{children}</ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
