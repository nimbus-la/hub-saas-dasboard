import type { VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";

import { metricCardIconVariants } from "@/components";
import type { Product } from "@/lib/products";


/* ── Tarjeta de producto ───────────────────────────────────────────────────── */

export interface ProductCardProps {
    product: Product;
    /**
     * Abre la edición del producto. Si no se pasa, el botón no se dibuja:
     * hay vistas (consulta, selección) donde la tarjeta no debe editar nada.
     */
    onEdit?: ((product: Product) => void) | undefined;
    /**
     * Pide eliminar el producto. La tarjeta solo avisa; la confirmación y el
     * borrado real son responsabilidad de la pantalla que la usa.
     */
    onDelete?: ((product: Product) => void) | undefined;
    className?: string;
}


export interface ProductThumbnailProps {
    /** Nombre del producto: de aquí salen las iniciales del respaldo. */
    name: string;
    /** URL que devuelve el servicio. Sin ella se pintan las iniciales. */
    src?: string | undefined;
    /** Producto no vendible: la miniatura se apaga, el texto nunca. */
    dimmed?: boolean;
}


/* ── Tarjeta de métrica ────────────────────────────────────────────────────── */

/** Familia semántica del cuadro del icono — se deriva de las variantes. */
export type MetricCardColor = NonNullable<
    VariantProps<typeof metricCardIconVariants>["color"]
>;


export interface MetricCardProps extends VariantProps<typeof metricCardIconVariants> {
    icon: LucideIcon;
    label: string;
    value: string | number;
    /** Variación del periodo (ej. 12.5, -3.2). El signo decide ▲/▼ y el color. */
    delta: number;
    /** Texto de contexto de la variación (ej. "vs. mes anterior"). */
    deltaLabel?: string;
    className?: string;
};
