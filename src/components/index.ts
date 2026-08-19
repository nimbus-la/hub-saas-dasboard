export * from './buttons/GenericButton';

// ── Barra superior ──────────────────────────────────────────────────────────
export { default as Navbar } from './navbar/Navbar';
export * from './navbar/navbar.style';

// ── Menú lateral ────────────────────────────────────────────────────────────
export { default as Sidebar } from './sidebar/Sidebar';
export * from './sidebar/sidebar-button.style';
export * from './sidebar/sidebar-group.style';
export * from './sidebar/sidebar-nav-item.style';
export * from './sidebar/sidebar.style';
export { default as SidebarButton } from './sidebar/SidebarButton';
export { default as SidebarGroup } from './sidebar/SidebarGroup';
export { default as SidebarNavItem } from './sidebar/SidebarNavItem';

// ── Tarjetas ────────────────────────────────────────────────────────────────
export * from './cards/metric-card.style';
export { default as MetricCard } from './cards/MetricCard';
export * from './cards/product-card.style';
export * from './cards/product-thumbnail.style';
export { default as ProductCard } from './cards/ProductCard';
export { default as ProductThumbnail } from './cards/ProductThumbnail';

// ── Botones ─────────────────────────────────────────────────────────────────
export { genericButtonVariants } from './buttons/generic-button.style';
export { default as GenericButton } from './buttons/GenericButton';
export { linkButtonVariants } from './buttons/link-button.style';
export { default as LinkButton } from './buttons/LinkButton';

// ── Tablas ──────────────────────────────────────────────────────────────────
export type { ColumnAlign } from '../interfaces/data-table.types';
export * from './tables/data-table-checkbox.style';
export * from './tables/data-table.style';
export { default as DataTable } from './tables/DataTable';
export { default as DataTableCheckbox } from './tables/DataTableCheckbox';
export * from './tables/title-subtitle-cell.style';
export { default as TitleSubtitleCell } from './tables/TitleSubtitleCell';
// Los props viven en `@/interfaces`; se reexportan para no romper a quien ya
// los importaba desde este barril.
export type { DataTableProps } from '../interfaces/components/tables.interfaces';


// ── Avisos ──────────────────────────────────────────────────────────────────
// `Alert` es la caja —sirve dentro de una pantalla—; `AlertToaster` es la pila
// flotante, que se monta una sola vez en el layout raíz, y `notify` la forma de
// hablarle desde cualquier sitio.
export { default as Alert } from './alerts/Alert';
export * from './alerts/alert.style';
export { default as AlertToaster, notify } from './alerts/AlertToaster';
export * from "./alerts/notify-api";


// ── Insignias ───────────────────────────────────────────────────────────────
export { statusBadgeVariants } from './badges/status-badge.style';
export { default as StatusBadge } from './badges/StatusBadge';

// ── Avatares ────────────────────────────────────────────────────────────────
export {
    Avatar,
    AvatarBadge,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage
} from './avatars/Avatar';

// ── Navegación y listados ───────────────────────────────────────────────────
export { default as Pagination } from './pagination/Pagination';
export * from './pagination/pagination.style';
export * from './tabs/filter-tabs.style';
export { FilterTabs } from './tabs/FilterTabs';

// ── Formularios ─────────────────────────────────────────────────────────────
export { InputSelector } from './inputs/InputSelector';
export { TextAreaField } from './inputs/TextAreaField';
export { TextField } from './inputs/TextField';

// ── Interruptores ───────────────────────────────────────────────────────────
export { Switch } from './toggles/Switch';
export * from './toggles/switch.style';



// ── Diálogos ────────────────────────────────────────────────────────────────
export * from './modals/confirm-dialog.style';
export { default as ConfirmDialog } from './modals/ConfirmDialog';
export { default as Modal } from './modals/Modal';
export * from './modals/modal.style';



// ── Armazón ─────────────────────────────────────────────────────────────────
export * from './layout/page-header.style';
export { default as PageHeader } from './layout/PageHeader';

