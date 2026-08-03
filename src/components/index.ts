export * from './buttons/GenericButton';
export * from './cards/MetricCard';
export * from './sidebar/Sidebar';

// ── Tarjetas ────────────────────────────────────────────────────────────────
export { default as ProductCard } from './cards/ProductCard';

// ── Botones ─────────────────────────────────────────────────────────────────
export { default as LinkButton } from './buttons/LinkButton';

// ── Tablas ──────────────────────────────────────────────────────────────────
export { default as DataTable } from './tables/DataTable';
export type { DataTableProps } from './tables/DataTable';
export { default as TitleSubtitleCell } from './tables/TitleSubtitleCell';
export type { ColumnAlign } from '../interfaces/data-table.types';

// ── Insignias ───────────────────────────────────────────────────────────────
export { default as StatusBadge } from './badges/StatusBadge';

// ── Navegación y listados ───────────────────────────────────────────────────
export { FilterTabs } from './tabs/FilterTabs';
export { default as Pagination } from './pagination/Pagination';

// ── Formularios ─────────────────────────────────────────────────────────────
export { InputSelector } from './inputs/InputSelector';
export { TextField } from './inputs/TextField';
