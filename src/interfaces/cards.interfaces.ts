import type { Product } from "@/lib/products";

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
