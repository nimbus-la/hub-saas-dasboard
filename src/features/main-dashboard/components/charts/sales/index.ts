// ── Gráfico de ventas por sucursal ──────────────────────────────────────────
// API pública de la carpeta: `SalesChartSection` (contenedor con los filtros) y
// `SalesChart` (presentacional, por si se necesita controlado desde fuera). La
// leyenda, el filtro de periodo y la tabla accesible son piezas internas.

export { default as SalesChart } from "./SalesChart";
export { default as SalesChartSection } from "./SalesChartSection";
