// ── Datos de ventas por sucursal ────────────────────────────────────────────
// Módulo de datos DESACOPLADO del componente. Hoy devuelve un mock determinista;
// cuando existan los servicios, reemplaza `getBranchSales` por tu fetch a la API
// (puede volverse async y devolver el mismo shape `BranchSalesData`).

export type PeriodKey = "dias" | "semanas" | "meses";

/** Id que representa "todas las sucursales" en los filtros. */
export const ALL_BRANCHES = "todas";

export interface Branch {
    id: string;
    name: string;
    color: string; // hex del token correspondiente en style.css
}

export interface SalesSeries extends Branch {
    data: number[];
    total: number;
}

export interface BranchSalesData {
    labels: string[];
    series: SalesSeries[];
}

// ── Sucursales (color = valor del token; mantener en sync con style.css) ─────
export const BRANCHES: Branch[] = [
    { id: "centro", name: "Sucursal Centro", color: "#22C55E" }, // success-main
    { id: "norte", name: "Sucursal Norte", color: "#FFAB00" }, // warning-main
    { id: "sur", name: "Sucursal Sur", color: "#00B8D9" }, // info-main
    { id: "plaza", name: "Sucursal Plaza", color: "#8E33FF" }, // secondary-main
];

// ── Periodos y etiquetas de eje ─────────────────────────────────────────────
export interface Period {
    key: PeriodKey;
    label: string;
    labels: string[];
}

export const PERIODS: Period[] = [
    { key: "dias", label: "Días", labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] },
    { key: "semanas", label: "Semanas", labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"] },
    { key: "meses", label: "Meses", labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] },
];

const DEFAULT_PERIOD_KEY: PeriodKey = "meses";

// ── Mock determinista (mismo resultado en cada render → sin hydration issues) ─
// Importe base por punto según el periodo: un día vende mucho menos que un mes.
// Guardan la proporción real entre periodos (una semana ≈ 7 días, un mes ≈ 4,3
// semanas), así el eje Y baja de ~$5M en "Meses" a ~$1.1M y ~$170K sin tocar la
// escala a mano: se ajusta sola a los datos de cada filtro.
const PERIOD_AMPLITUDE: Record<PeriodKey, number> = {
    dias: 90_000,
    semanas: 600_000,
    meses: 2_500_000,
};

// Peso relativo de cada sucursal, en el mismo orden que `BRANCHES`.
const BRANCH_WEIGHTS = [1.0, 1.28, 0.72, 0.9];

/**
 * Genera un importe reproducible combinando una onda suave (la tendencia) con
 * una segunda onda de frecuencia alta (el ruido), desfasadas por sucursal para
 * que las líneas no queden paralelas.
 */
function calculateSalesValue(
    branchIndex: number,
    period: PeriodKey,
    pointIndex: number
): number {
    const amplitude = PERIOD_AMPLITUDE[period];
    const trend = (Math.sin(pointIndex * 0.8 + branchIndex * 1.7) + 1) / 2;
    const noise = ((Math.sin(pointIndex * 3.1 + branchIndex) + 1) / 2) * 0.25;
    const branchWeight = BRANCH_WEIGHTS[branchIndex] ?? 1;

    return Math.round(amplitude * branchWeight * (0.6 + 0.6 * trend + noise));
}

function findPeriod(periodKey: PeriodKey): Period {
    const defaultPeriod = PERIODS.find(({ key }) => key === DEFAULT_PERIOD_KEY)!;
    return PERIODS.find(({ key }) => key === periodKey) ?? defaultPeriod;
}

/** Con `branch === ALL_BRANCHES` devuelve todas las sucursales; si no, solo la elegida. */
export function getBranchSales(
    period: PeriodKey,
    branch: string
): BranchSalesData {
    const selectedPeriod = findPeriod(period);
    const selectedBranches =
        branch === ALL_BRANCHES
            ? BRANCHES
            : BRANCHES.filter((candidate) => candidate.id === branch);

    const series: SalesSeries[] = selectedBranches.map((selectedBranch) => {
        // El índice dentro de BRANCHES define la forma de la onda y el peso, así
        // que una sucursal dibuja la misma línea se filtre o no.
        const branchIndex = BRANCHES.findIndex(
            (candidate) => candidate.id === selectedBranch.id
        );

        const data = selectedPeriod.labels.map((_label, pointIndex) =>
            calculateSalesValue(branchIndex, period, pointIndex)
        );
        const total = data.reduce((runningTotal, value) => runningTotal + value, 0);

        return { ...selectedBranch, data, total };
    });

    return { labels: [...selectedPeriod.labels], series };
}

// ── Formateadores compartidos ───────────────────────────────────────────────
const compactNumberFormatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
});

/** Ejes y leyenda: `$380K`. */
export const formatMoneyCompact = (amount: number): string =>
    "$" + compactNumberFormatter.format(amount);

/** Tooltip y métrica principal: `$380,412`. */
export const formatMoneyFull = (amount: number): string =>
    "$" + amount.toLocaleString("es-MX");
