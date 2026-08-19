import Link from "next/link";

import { cn } from "@/lib/utils";
import type { PageHeaderProps } from "@/interfaces";
import { CONTROL_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import {
    pageHeaderActionsVariants,
    pageHeaderBackVariants,
    pageHeaderLeadVariants,
    pageHeaderSubtitleVariants,
    pageHeaderTextVariants,
    pageHeaderTitleRowVariants,
    pageHeaderTitleVariants,
    pageHeaderVariants,
} from "./page-header.style";


/**
 * PageHeader
 *
 * Encabezado de una pantalla del panel: flecha de regreso, título, insignia de
 * contexto, bajada y la acción principal. Va por encima del contenido: dice
 * dónde estás y cómo salir antes de pedirte nada.
 *
 * Todas las partes salvo el título son opcionales, y ese es el punto: la misma
 * cabecera sirve para una lista de primer nivel —sin flecha— y para un
 * formulario anidado, sin que cada pantalla reinvente la fila del título.
 */
export default function PageHeader({
    title,
    subtitle,
    backHref,
    backLabel,
    badge,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <div className={cn(pageHeaderVariants(), className)}>
            <div className={pageHeaderLeadVariants()}>
                {backHref && (
                    <Link
                        href={backHref}
                        aria-label={backLabel}
                        className={pageHeaderBackVariants()}
                    >
                        <ICON_TOKENS.BACK
                            size={CONTROL_SIZE.md.iconSize}
                            strokeWidth={ICON_STROKE_BY_SIZE.md}
                            aria-hidden="true"
                        />
                    </Link>
                )}

                <div className={pageHeaderTextVariants()}>
                    <div className={pageHeaderTitleRowVariants()}>
                        <h1 className={pageHeaderTitleVariants()}>{title}</h1>

                        {badge}
                    </div>

                    {subtitle && (
                        <p className={pageHeaderSubtitleVariants()}>{subtitle}</p>
                    )}
                </div>
            </div>

            {actions && (
                <div className={pageHeaderActionsVariants()}>{actions}</div>
            )}
        </div>
    );
};
