// ── Alternativa accesible al gráfico ────────────────────────────────────────
// Un <canvas> no es navegable por lector de pantalla: esta tabla expone los
// mismos datos en texto. Va oculta visualmente (`sr-only`), no en display:none,
// para que siga estando en el árbol de accesibilidad.
//
// `sr-only` va en un <div> envolvente, no en la <table>: para una tabla el
// `width: 1px` es solo un mínimo (crece con su contenido) y el ancho real
// acabaría estirando el scroll horizontal de la página.

import { formatMoneyFull, type SalesSeries } from "@/lib/branch-sales";

interface SalesChartDataTableProps {
    labels: string[];
    series: SalesSeries[];
}

export default function SalesChartDataTable({
    labels,
    series,
}: SalesChartDataTableProps) {
    return (
        <div className="sr-only">
            <table>
                <caption>Ventas por sucursal y periodo</caption>

                <thead>
                    <tr>
                        <th scope="col">Periodo</th>
                        {series.map((branchSeries) => (
                            <th key={branchSeries.id} scope="col">
                                {branchSeries.name}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {labels.map((label, pointIndex) => (
                        <tr key={label}>
                            <th scope="row">{label}</th>
                            {series.map((branchSeries) => (
                                <td key={branchSeries.id}>
                                    {formatMoneyFull(branchSeries.data[pointIndex] ?? 0)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
