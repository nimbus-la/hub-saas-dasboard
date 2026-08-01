// ── Alternativa accesible a la dona ─────────────────────────────────────────
// Un <canvas> no es navegable por lector de pantalla y una gráfica de porciones
// depende del color: esta tabla expone los mismos datos en texto. Va oculta
// visualmente (`sr-only`), no en display:none, para seguir en el árbol de
// accesibilidad.
//
// `sr-only` va en un <div> envolvente, no en la <table>: para una tabla el
// `width: 1px` es solo un mínimo (crece con su contenido) y el ancho real
// acabaría estirando el scroll horizontal de la página.

import { formatMoneyFull } from "@/lib/branch-sales";
import {
    formatShare,
    formatUnitPrice,
    formatUnits,
    type RankedProduct,
} from "@/lib/top-products";

interface TopProductsDataTableProps {
    products: RankedProduct[];
    totalUnits: number;
}

export default function TopProductsDataTable({
    products,
    totalUnits,
}: TopProductsDataTableProps) {
    return (
        <div className="sr-only">
            <table>
                <caption>
                    Top {products.length} de productos más vendidos este mes.{" "}
                    {formatUnits(totalUnits)} unidades en total.
                </caption>

                <thead>
                    <tr>
                        <th scope="col">Puesto</th>
                        <th scope="col">Producto</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Unidades vendidas</th>
                        <th scope="col">Participación</th>
                        <th scope="col">Precio unitario</th>
                        <th scope="col">Ventas totales</th>
                    </tr>
                </thead>

                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <th scope="row">{product.rank}</th>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>{formatUnits(product.units)}</td>
                            <td>{formatShare(product.share)}</td>
                            <td>{formatUnitPrice(product.price)}</td>
                            <td>{formatMoneyFull(product.revenue)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
