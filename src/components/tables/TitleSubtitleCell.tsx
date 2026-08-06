// ── Celda de título + subtítulo ─────────────────────────────────────────────
// Celda compuesta reutilizable para tablas y listados: un elemento visual
// opcional a la izquierda (avatar, ícono, miniatura), un título y un subtítulo
// opcional debajo. Ambos textos truncan en una línea para que todas las filas
// conserven la misma altura sin importar el largo del contenido.

import type { TitleSubtitleCellProps } from "@/interfaces";
import { cn } from "@/lib/utils";

import {
    titleSubtitleCellMediaVariants,
    titleSubtitleCellSubtitleVariants,
    titleSubtitleCellTextVariants,
    titleSubtitleCellTitleVariants,
    titleSubtitleCellVariants,
} from "./title-subtitle-cell.style";


export default function TitleSubtitleCell({
    title,
    subtitle,
    media,
    className,
}: TitleSubtitleCellProps) {
    return (
        <div className={cn(titleSubtitleCellVariants(), className)}>
            {media && (
                <div className={titleSubtitleCellMediaVariants()}>{media}</div>
            )}

            <div className={titleSubtitleCellTextVariants()}>
                <span className={titleSubtitleCellTitleVariants()}>{title}</span>

                {subtitle && (
                    <span className={titleSubtitleCellSubtitleVariants()}>
                        {subtitle}
                    </span>
                )}
            </div>
        </div>
    );
};
