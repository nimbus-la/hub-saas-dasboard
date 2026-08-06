export * from './buttons/GenericButton';

// ── Barra superior ──────────────────────────────────────────────────────────
export { default as Navbar } from './navbar/Navbar';
export * from './navbar/navbar.style';

// ── Menú lateral ────────────────────────────────────────────────────────────
export { default as Sidebar } from './sidebar/Sidebar';
export { default as SidebarButton } from './sidebar/SidebarButton';
export { default as SidebarGroup } from './sidebar/SidebarGroup';
export { default as SidebarNavItem } from './sidebar/SidebarNavItem';
export * from './sidebar/sidebar.style';
export * from './sidebar/sidebar-button.style';
export * from './sidebar/sidebar-group.style';
export * from './sidebar/sidebar-nav-item.style';

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
export { default as DataTableCheckbox } from './tables/DataTableCheckbox';
export { default as TitleSubtitleCell } from './tables/TitleSubtitleCell';
export * from './tables/data-table.style';
export * from './tables/data-table-checkbox.style';
export * from './tables/title-subtitle-cell.style';
export type { ColumnAlign } from '../interfaces/data-table.types';
// Los props viven en `@/interfaces`; se reexportan para no romper a quien ya
// los importaba desde este barril.
export type { DataTableProps } from '../interfaces/components/tables.interfaces';

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
export * from './tabs/filter-tabs.style';
export { default as Pagination } from './pagination/Pagination';
export * from './pagination/pagination.style';

// ── Formularios ─────────────────────────────────────────────────────────────
export { InputSelector } from './inputs/InputSelector';
export { TextAreaField } from './inputs/TextAreaField';
export { TextField } from './inputs/TextField';

// ── Interruptores ───────────────────────────────────────────────────────────
export { Switch } from './toggles/Switch';
export * from './toggles/switch.style';
