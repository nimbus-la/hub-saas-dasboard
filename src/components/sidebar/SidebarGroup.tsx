import React from "react";

import { motion } from "framer-motion";
import { ChevronRight } from 'lucide-react';
import { useSidebarLayout } from "@/context";


interface SidebarGroupProps {
    label: string;
    children: React.ReactNode;
};

export default function SidebarGroup({ label, children }: SidebarGroupProps) {
    const { isCollapsed } = useSidebarLayout();
    const [isOpen, setIsOpen] = React.useState(true);

    if (isCollapsed) {
        return <ul className="space-y-0.5">{children}</ul>;
    };

    return (
        <div>
            <motion.button
                onClick={() => setIsOpen((prev) => !prev)}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="group mb-1 flex w-full cursor-pointer items-center rounded-md px-3 py-1.5"
            >
                {/* Flecha — aparece suavemente sin moverse */}
                <motion.div
                    variants={{
                        rest: { opacity: 0 },
                        hover: { opacity: 1 },
                    }}
                    transition={{ duration: 0.35 }}
                    className="mr-0.2 shrink-0"
                >
                    <ChevronRight
                        size={14}
                        strokeWidth={3}
                        className={`text-neutral-400 transition-transform group-hover:text-neutral-800 duration-200 ${isOpen ? "rotate-90" : "rotate-0"}`}
                    />
                </motion.div>

                {/* Texto — se desliza suavemente a la derecha */}
                <motion.p
                    variants={{
                        rest: { x: 0 },
                        hover: { x: 4 },
                    }}
                    transition={{ duration: 0.35 }}
                    className="text-[11px] font-bold text-neutral-500 uppercase group-hover:text-neutral-800"
                >
                    {label}
                </motion.p>
            </motion.button>

            <ul className={`space-y-0.5 overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                {children}
            </ul>
        </div>
    )
};