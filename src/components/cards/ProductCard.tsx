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
import { ICON_SIZE, ICON_STROKE, ICON_STROKE_BY_SIZE } from "@/tokens";

import {
    productCardActionsVariants,
    productCardAlertIconVariants,
    productCardAlertVariants,
    productCardAlertWrapperVariants,
    productCardBadgeVariants,
    productCardBodyVariants,
    productCardCategoryVariants,
    productCardIngredientsVariants,
    productCardMediaVariants,
    productCardMetaVariants,
    productCardNameVariants,
    productCardPriceVariants,
    productCardVariants,
} from "./product-card.style";


export default function ProductCard({
    product,
    onEdit,
    onDelete,
    className,
}: ProductCardProps) {
    // Inactivo o sin insumos: la tarjeta se apaga para que la fila se lea de un
    // vistazo. El apagado es deliberadamente tenue —lo hace la escala de grises
    // de la miniatura, no un gris oscuro de fondo—: un producto inactivo sigue
    // siendo editable y no debe leerse como deshabilitado.
    const isDimmed = isProductUnavailable(product.status);

    const hasActions = Boolean(onEdit || onDelete);

    // Id derivado del producto en lugar de `useId`: así la tarjeta sigue
    // sirviendo en un Server Component.
    const titleId = `product-card-${product.id}-title`;

    return (
        <article
            aria-labelledby={titleId}
            className={cn(productCardVariants({ dimmed: isDimmed }), className)}
        >
            {/* ── Imagen + estado ────────────────────────────────────────── */}
            <div className={productCardMediaVariants({ dimmed: isDimmed })}>
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
                    className={productCardBadgeVariants()}
                />
            </div>

            {/* ── Categoría, nombre e ingredientes ───────────────────────── */}
            <div className={productCardBodyVariants()}>
                <span className={productCardCategoryVariants()}>
                    {product.category}
                </span>

                <h3 id={titleId} className={productCardNameVariants()}>
                    {product.name}
                </h3>

                <div className={productCardMetaVariants()}>
                    <span className={productCardIngredientsVariants()}>
                        <ListChecks
                            size={ICON_SIZE.sm}
                            strokeWidth={ICON_STROKE_BY_SIZE.sm}
                            aria-hidden="true"
                            className="shrink-0 self-center"
                        />
                        <span className="truncate tabular-nums">
                            {formatIngredients(product.ingredientsCount)}
                        </span>
                    </span>

                    <span className={productCardPriceVariants()}>
                        <span className="sr-only">Precio: </span>
                        {formatCurrency(product.price)}
                    </span>
                </div>
            </div>

            {/* ── Alerta del servicio (solo lectura) ─────────────────────── */}
            {product.alert && (
                <div className={productCardAlertWrapperVariants()}>
                    <p className={productCardAlertVariants()}>
                        {/* Trazo `bold`: el sistema lo reserva para los iconos
                            que cargan significado por sí solos. */}
                        <TriangleAlert
                            size={ICON_SIZE.md}
                            strokeWidth={ICON_STROKE.bold}
                            aria-hidden="true"
                            className={productCardAlertIconVariants()}
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
                <div className={productCardActionsVariants()}>
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
