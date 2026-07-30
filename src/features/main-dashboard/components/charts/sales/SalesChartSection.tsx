"use client";

// ── Contenedor de datos del gráfico de ventas ───────────────────────────────
// Mantiene el estado de los filtros y obtiene los datos, dejando a SalesChart
// como componente puramente presentacional.
//
// Cuando existan servicios: cambia `getBranchSales(...)` por tu fetch/hook.
// Ejemplo async:
//   const [data, setData] = useState<BranchSalesData | null>(null);
//   useEffect(() => { fetchBranchSales(period, branch).then(setData); }, [period, branch]);
//
// Y cuando el selector se mueva al navbar, sube `branch`/`setBranch` a un
// context o store y elimina el estado local.

import { useMemo, useState } from "react";
import {
    ALL_BRANCHES,
    getBranchSales,
    type PeriodKey,
} from "@/lib/branch-sales";
import SalesChart from "./SalesChart";

const INITIAL_PERIOD: PeriodKey = "meses";

export default function SalesChartSection({ className }: { className?: string }) {
    const [period, setPeriod] = useState<PeriodKey>(INITIAL_PERIOD);
    const [branch, setBranch] = useState<string>(ALL_BRANCHES);

    const { labels, series } = useMemo(
        () => getBranchSales(period, branch),
        [period, branch]
    );

    return (
        <SalesChart
            className={className}
            labels={labels}
            series={series}
            period={period}
            branch={branch}
            onPeriodChange={setPeriod}
            onBranchChange={setBranch}
        />
    );
};
