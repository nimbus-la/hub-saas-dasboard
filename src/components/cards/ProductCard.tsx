import { ListChecks, Pencil, Trash2, TriangleAlert } from "lucide-react";

import StatusBadge from "@/components/badges/StatusBadge";
import ProductThumbnail from "@/components/cards/ProductThumbnail";
import GenericButton from "@/components/buttons/GenericButton";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
    formatIngredients,
    isProductUnavailable,
    PRODUCT_STATUS_LABELS,
    PRODUCT_STATUS_TONES,
} from "@/lib/products";
import type { ProductCardProps } from "@/interfaces";

export default function ProductCard({
    product,
    onEdit,
    onDelete,
    className,
}: ProductCardProps) {
    // Inactivo o sin insumos: la tarjeta se apaga para que la fila se lea de un
    // vistazo. Se apagan la superficie y la imagen —lo decorativo—, nunca el
    // texto ni los botones: bajar su contraste sería quitar accesibilidad para
    // ganar estilo.
    //
    // El apagado es deliberadamente tenue: quien hace el trabajo es la escala
    // de grises de la miniatura, no un gris oscuro de fondo. Un producto
    // inactivo sigue siendo editable y no debe leerse como deshabilitado.
    const isDimmed = isProductUnavailable(product.status);

    const hasActions = Boolean(onEdit || onDelete);

    // Id derivado del producto en lugar de `useId`: así la tarjeta sigue
    // sirviendo en un Server Component.
    const titleId = `product-card-${product.id}-title`;

    return (
        <article
            aria-labelledby={titleId}
            className={cn(
                "flex min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-200",
                "transition-colors duration-150 ease-out motion-reduce:transition-none",
                "hover:border-neutral-300",
                isDimmed ? "bg-neutral-100" : "bg-white",
                className
            )}
        >
            {/* ── Imagen + estado ────────────────────────────────────────── */}
            {/* El 4:3 reserva el hueco antes de que la foto llegue: sin él la
                rejilla entera saltaría al cargar cada miniatura. */}
            <div
                className={cn(
                    "relative aspect-4/3 overflow-hidden",
                    isDimmed ? "bg-neutral-200" : "bg-neutral-100"
                )}
            >
                <ProductThumbnail
                    name={product.name}
                    src={product.image}
                    dimmed={isDimmed}
                />

                {/* La insignia se queda a plena opacidad: es justo el dato que
                    explica por qué la tarjeta está apagada. */}
                <StatusBadge
                    tone={PRODUCT_STATUS_TONES[product.status]}
                    label={PRODUCT_STATUS_LABELS[product.status]}
                    className="absolute top-3 right-3"
                />
            </div>

            {/* ── Categoría, nombre e ingredientes ───────────────────────── */}
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 px-4 pt-3.5 pb-4">
                {/* neutral-600 y no 500: a 11px la categoría necesita los
                    4.5:1 sobre blanco que el gris claro no alcanza. */}
                <span className="truncate text-[11px] font-semibold tracking-wide text-neutral-600 uppercase">
                    {product.category}
                </span>

                {/* Dos líneas como máximo: así todas las tarjetas de una fila
                    mantienen la misma altura aunque los nombres varíen. */}
                <h3
                    id={titleId}
                    className="line-clamp-2 text-sm font-bold text-neutral-800"
                >
                    {product.name}
                </h3>

                {/* Insumos y precio comparten la última línea: el precio queda
                    siempre a la misma altura en toda la fila, que es lo que
                    permite compararlos de un barrido vertical. */}
                <div className="mt-auto flex min-w-0 items-baseline justify-between gap-2 pt-1.5">
                    <span className="flex min-w-0 items-center gap-1.5 text-xs text-neutral-600">
                        <ListChecks
                            size={14}
                            aria-hidden="true"
                            className="shrink-0 self-center"
                        />
                        <span className="truncate tabular-nums">
                            {formatIngredients(product.ingredientsCount)}
                        </span>
                    </span>

                    {/* Cifras tabulares: sin ellas los precios de la rejilla no
                        alinean sus dígitos y la columna se ve temblorosa. */}
                    <span className="shrink-0 text-base font-bold tabular-nums text-neutral-800">
                        <span className="sr-only">Precio: </span>
                        {formatCurrency(product.price)}
                    </span>
                </div>
            </div>

            {/* ── Alerta del servicio (solo lectura) ─────────────────────── */}
            {product.alert && (
                <div className="px-3 pb-3">
                    <p
                        className={cn(
                            "flex items-start gap-2 rounded-lg bg-warning-lighter px-2.5 py-2",
                            "text-xs font-semibold text-warning-darker wrap-anywhere"
                        )}
                    >
                        <TriangleAlert
                            size={16}
                            aria-hidden="true"
                            className="mt-px shrink-0 text-warning-dark"
                        />

                        {/* El icono no se anuncia; sin este prefijo la nota
                            llegaría al lector de pantalla sin decir qué es. */}
                        <span className="min-w-0 flex-1">
                            <span className="sr-only">Alerta: </span>
                            {product.alert}
                        </span>
                    </p>
                </div>
            )}

            {/* ── Acciones ───────────────────────────────────────────────── */}
            {hasActions && (
                <div className="flex items-center gap-2 border-t border-neutral-200 p-3">
                    {onEdit && (
                        <GenericButton
                            variant="secondary"
                            fullWidth
                            label="Editar"
                            startIcon={Pencil}
                            // El nombre completo en la etiqueta accesible: veinte
                            // botones "Editar" seguidos no distinguen nada. Empieza
                            // por el texto visible (WCAG 2.5.3).
                            aria-label={`Editar ${product.name}`}
                            onClick={() => onEdit(product)}
                            className="border border-neutral-300 text-neutral-700"
                        />
                    )}

                    {onDelete && (
                        <GenericButton
                            variant="danger"
                            icon={Trash2}
                            // Sin etiqueta visible por espacio, pero el destructivo
                            // se separa del primario por color y posición.
                            aria-label={`Eliminar ${product.name}`}
                            title={`Eliminar ${product.name}`}
                            onClick={() => onDelete(product)}
                        />
                    )}
                </div>
            )}
        </article>
    );
};
