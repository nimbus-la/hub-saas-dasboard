import {
    Home,
    Package,
    ClipboardList,
    ShoppingBasket,
    Users,
    PanelRightClose,
    PanelRightOpen,
    Flame,
    X,
} from "lucide-react";


export const ICON_TOKENS = {
    DASHBOARD: Home,
    PRODUCTS: Package,
    INVENTORY: ClipboardList,
    ORDERS: ShoppingBasket,
    EMPLEOYES: Users,
    PANEL_RIGHT_OPEN: PanelRightOpen,
    PANEL_RIGHT_CLOSE: PanelRightClose,
    FLAME: Flame,
    CLOSE: X,
} as const;


export type IconToken = keyof typeof ICON_TOKENS;