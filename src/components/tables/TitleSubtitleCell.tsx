// ── Celda de título + subtítulo ─────────────────────────────────────────────
// Celda compuesta reutilizable para tablas y listados: un elemento visual
// opcional a la izquierda (avatar, ícono, miniatura), un título y un subtítulo
// opcional debajo. Ambos textos truncan en una línea para que todas las filas
// conserven la misma altura sin importar el largo del contenido.

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";


interface TitleSubtitleCellProps {
    title: ReactNode;
    /** Línea secundaria (correo, categoría, SKU…). Se omite si no se pasa. */
    subtitle?: ReactNode;
    /** Elemento visual a la izquierda: avatar, ícono o miniatura. */
    media?: ReactNode;
    className?: string;
};


export default function TitleSubtitleCell({
    title,
    subtitle,
    media,
    className,
}: TitleSubtitleCellProps) {
    return (
        <div className={cn("flex min-w-0 items-center gap-3", className)}>
            {media && <div className="shrink-0">{media}</div>}

            <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-neutral-800">
                    {title}
                </span>

                {subtitle && (
                    <span className="truncate text-xs text-neutral-500">
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
};
