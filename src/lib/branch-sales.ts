// ── Datos de ventas por sucursal ────────────────────────────────────────────
// Módulo de datos DESACOPLADO del componente. Hoy devuelve un mock determinista;
// cuando existan los servicios, reemplaza `getBranchSales` por tu fetch a la API
// (puede volverse async y devolver el mismo shape `BranchSalesData`).

export type PeriodKey = "dias" | "semanas" | "meses";

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
export const PERIODS: { key: PeriodKey; label: string; labels: string[] }[] = [
    { key: "dias", label: "Días", labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"] },
    { key: "semanas", label: "Semanas", labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4", "Sem 5", "Sem 6", "Sem 7", "Sem 8"] },
    { key: "meses", label: "Meses", labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"] },
];

// ── Mock determinista (mismo resultado en cada render → sin hydration issues) ─
const AMP: Record<PeriodKey, number> = { dias: 16000, semanas: 95000, meses: 380000 };
const BRANCH_FACTOR = [1.0, 1.28, 0.72, 0.9];

function salesValue(branchIndex: number, period: PeriodKey, i: number): number {
    const amp = AMP[period];
    const wave = (Math.sin(i * 0.8 + branchIndex * 1.7) + 1) / 2;
    const jitter = ((Math.sin(i * 3.1 + branchIndex) + 1) / 2) * 0.25;
    const factor = BRANCH_FACTOR[branchIndex] ?? 1;
    return Math.round(amp * factor * (0.6 + 0.6 * wave + jitter));
}

// Con `branch === "todas"` apila todas las sucursales; si no, solo la elegida.
export function getBranchSales(period: PeriodKey, branch: string): BranchSalesData {
    const DEFAULT_PERIOD = PERIODS.find((p) => p.key === "meses")!;
    const cfg = PERIODS.find((p) => p.key === period) ?? DEFAULT_PERIOD;
    const active = branch === "todas" ? BRANCHES : BRANCHES.filter((b) => b.id === branch);

    const series: SalesSeries[] = active.map((b) => {
        const gi = BRANCHES.findIndex((x) => x.id === b.id);
        const data = cfg.labels.map((_, i) => salesValue(gi, period, i));
        const total = data.reduce((acc, cur) => acc + cur, 0);
        return { ...b, data, total };
    });

    return { labels: [...cfg.labels], series };
}

// ── Formateadores compartidos ───────────────────────────────────────────────
const compact = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const fmtMoney = (n: number) => "$" + compact.format(n);              // ejes y leyenda
export const fmtMoneyFull = (n: number) => "$" + n.toLocaleString("es-MX");  // tooltip