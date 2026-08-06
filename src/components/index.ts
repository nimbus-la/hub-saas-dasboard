export * from './buttons/GenericButton';
export * from './sidebar/Sidebar';

// ── Tarjetas ────────────────────────────────────────────────────────────────
export { default as ProductCard } from './cards/ProductCard';
export { default as ProductThumbnail } from './cards/ProductThumbnail';
export { default as MetricCard } from './cards/MetricCard';
export * from './cards/product-card.style';
export * from './cards/product-thumbnail.style';
export * from './cards/metric-card.style';

// ── Botones ─────────────────────────────────────────────────────────────────
export { default as LinkButton } from './buttons/LinkButton';
export { default as GenericButton } from './buttons/GenericButton';
export { linkButtonVariants } from './buttons/link-button.style';
export { genericButtonVariants } from './buttons/generic-button.style';

// ── Tablas ──────────────────────────────────────────────────────────────────
export { default as DataTable } from './tables/DataTable';
export type { DataTableProps } from './tables/DataTable';
export { default as TitleSubtitleCell } from './tables/TitleSubtitleCell';
export type { ColumnAlign } from '../interfaces/data-table.types';

// ── Insignias ───────────────────────────────────────────────────────────────
export { default as StatusBadge } from './badges/StatusBadge';
export { statusBadgeVariants } from './badges/status-badge.style';

// ── Avatares ────────────────────────────────────────────────────────────────
export {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from './avatars/Avatar';

// ── Navegación y listados ───────────────────────────────────────────────────
export { FilterTabs } from './tabs/FilterTabs';
export { default as Pagination } from './pagination/Pagination';
export * from './pagination/pagination.style';

// ── Formularios ─────────────────────────────────────────────────────────────
export { InputSelector } from './inputs/InputSelector';
export { TextField } from './inputs/TextField';
