// ── Alternativa accesible al gráfico ────────────────────────────────────────
// Un <canvas> no es navegable por lector de pantalla: esta tabla expone los
// mismos datos en texto. Va oculta visualmente (`sr-only`), no en display:none,
// para que siga estando en el árbol de accesibilidad.

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
        <table className="sr-only">
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
    );
};
