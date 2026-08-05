import { MenuStructurePrimary } from "@/interfaces";

/** Todas las urls navegables del menú, incluidas las de tercer nivel. */
export function collectMenuUrls(menu: MenuStructurePrimary[]): string[] {
    return menu.flatMap((section) =>
        section.items.flatMap((item) => [
            ...(item.url ? [item.url] : []),
            ...(item.items?.map((subItem) => subItem.url) ?? []),
        ])
    );
}

/**
 * Resuelve qué url del menú está activa para un pathname dado.
 *
 * Gana siempre la coincidencia más específica: con `/products` (Lista de
 * productos) y `/products/create` (Crear producto) en el menú, estar en
 * `/products/create` marca sólo "Crear producto". Y una ruta de detalle como
 * `/orders/42` sigue marcando "Ordenes" (`/orders`).
 */
export function getActiveMenuUrl(pathname: string, urls: string[]): string | null {
    let activeUrl: string | null = null;

    for (const url of urls) {
        const matches =
            url === "/"
                ? pathname === "/"
                : pathname === url || pathname.startsWith(`${url}/`);

        if (matches && (activeUrl === null || url.length > activeUrl.length)) {
            activeUrl = url;
        }
    }

    return activeUrl;
}
