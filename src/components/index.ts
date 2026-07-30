export * from './buttons/GenericButton';
export * from './cards/MetricCard';
export * from './sidebar/Sidebar';

// ── Botones ─────────────────────────────────────────────────────────────────
export { default as LinkButton } from './buttons/LinkButton';

// ── Tablas ──────────────────────────────────────────────────────────────────
export { default as DataTable } from './tables/DataTable';
export type { DataTableProps } from './tables/DataTable';
export { default as TitleSubtitleCell } from './tables/TitleSubtitleCell';
export type { ColumnAlign } from '../interfaces/data-table.types';

// ── Insignias ───────────────────────────────────────────────────────────────
export { default as StatusBadge } from './badges/StatusBadge';
