import {
    Home,
    Package,
    ClipboardList,
    ShoppingBasket,
    Users,
} from "lucide-react";


export const ICON_TOKENS = {
    DASHBOARD: Home,
    PRODUCTS: Package,
    INVENTORY: ClipboardList,
    ORDERS: ShoppingBasket,
    EMPLEOYES: Users,
} as const;


export type IconToken = keyof typeof ICON_TOKENS;