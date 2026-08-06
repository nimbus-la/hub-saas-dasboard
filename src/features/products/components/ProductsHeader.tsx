"use client";

// ── Cabecera de la pantalla de productos ────────────────────────────────────
// Título, total del catálogo y la acción principal. El total va pegado al
// título — no en el buscador — porque cuenta todo el catálogo y no cambia al
// filtrar; lo que sí cambia se resume junto a la paginación.

import GenericButton from "@/components/buttons/GenericButton";
import StatusBadge from "@/components/badges/StatusBadge";
import { cn } from "@/lib/utils";
import { formatProductCount } from "@/lib/products";
import { ICON_TOKENS } from "@/tokens";

import {
    productsHeaderCountVariants,
    productsHeaderDescriptionVariants,
    productsHeaderTextVariants,
    productsHeaderTitleRowVariants,
    productsHeaderTitleVariants,
    productsHeaderVariants,
} from "./products-header.style";

interface ProductsHeaderProps {
    /** Productos del catálogo completo, sin filtros aplicados. */
    totalProducts: number;
    onCreateProduct: () => void;
    className?: string;
}

export default function ProductsHeader({
    totalProducts,
    onCreateProduct,
    className,
}: ProductsHeaderProps) {
    return (
        <div className={cn(productsHeaderVariants(), className)}>
            <div className={productsHeaderTextVariants()}>
                <div className={productsHeaderTitleRowVariants()}>
                    <h1 className={productsHeaderTitleVariants()}>Productos</h1>

                    <StatusBadge
                        size="xs"
                        tone="neutral"
                        label={formatProductCount(totalProducts)}
                        className={productsHeaderCountVariants()}
                    />
                </div>

                <p className={productsHeaderDescriptionVariants()}>
                    Gestiona la carta de tus sucursales y avisa al equipo cuando falte
                    un insumo.
                </p>
            </div>

            {/* Cuando exista el formulario, basta con navegar a su ruta desde
                `onCreateProduct` para que el botón deje de ser un gancho. */}
            <GenericButton
                label="Crear producto"
                startIcon={ICON_TOKENS.CREATE}
                onClick={onCreateProduct}
                className="shrink-0"
            />
        </div>
    );
};
