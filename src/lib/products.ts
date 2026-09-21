// ── Dominio: productos ──────────────────────────────────────────────────────
// El producto tal como lo pinta la interfaz, sus estados y los textos que lo
// acompañan. Los datos llegan del servicio de `features/products`.
//
// `image` es la URL que devuelve el backend: Next la descarga y la optimiza.
// Es opcional a propósito — un producto recién creado puede no tener foto — y
// la tarjeta cae entonces a las iniciales del nombre. Para que Next acepte un
// origen remoto hay que declararlo en `images.remotePatterns` de
// next.config.ts (allí se explica cómo).

import { formatPlural, messages } from "@/messages";
import type { BadgeTone } from "@/interfaces";

/**
 * Estado operativo del producto.
 *
 *   · disponible    — se puede vender sin restricciones
 *   · stock-bajo    — vendible, pero algún insumo está por agotarse
 *   · no-disponible — publicado pero sin insumos para prepararlo
 *   · inactivo      — retirado de la carta por decisión del equipo
 */
export type ProductStatus =
    | "disponible"
    | "stock-bajo"
    | "no-disponible"
    | "inactivo";

export interface Product {
    id: string;
    name: string;
    category: string;
    /**
     * URL de la foto que publica el backend.
     *
     * Opcional: mientras no llegue —o si la descarga falla— la tarjeta pinta
     * las iniciales del nombre en su lugar, nunca un hueco vacío.
     */
    image?: string;
    price: number;              // precio de venta en COP (pesos enteros)
    status: ProductStatus;
    ingredientsCount: number;   // insumos que componen la receta
    /**
     * Aviso operativo que emite el servicio (ej. "Sin carne de res molida").
     *
     * Es de solo lectura para la interfaz: se muestra cuando viene y desaparece
     * cuando el servicio deja de mandarlo. Nadie la edita desde la tarjeta.
     */
    alert?: string;
}

// ── Presentación de los estados ─────────────────────────────────────────────
// El tono se resuelve aquí (no en la tarjeta) para que cualquier vista que
// muestre un producto — tarjeta, tabla o detalle — pinte el mismo color. El
// rótulo sale de `messages.products.status`, que usa estos mismos valores como
// claves.

export const PRODUCT_STATUS_TONES: Record<ProductStatus, BadgeTone> = {
    disponible: "success",
    "stock-bajo": "warning",
    "no-disponible": "error",
    inactivo: "neutral",
};

/**
 * ¿El producto no se puede vender ahora mismo?
 *
 * Vive aquí y no en la tarjeta porque es una regla de negocio: cualquier vista
 * que quiera apagar un producto —tarjeta, tabla o detalle— debe apagar los
 * mismos. `stock-bajo` no entra: todavía se vende.
 */
export const isProductUnavailable = (status: ProductStatus): boolean =>
    status === "no-disponible" || status === "inactivo";

/** Valor de la pestaña que no filtra por categoría. */
export const ALL_CATEGORIES = "todas";

// ── Etiquetas del dominio ───────────────────────────────────────────────────
// Solo el texto que acompaña a la cifra: el formato del número lo pone
// `@/lib/format`, y los precios se pintan con `formatCurrency` directamente.

/** `1 producto` · `22 productos` */
export const formatProductCount = (count: number): string =>
    formatPlural(messages.products.count, count);

/**
 * Palabras que no aportan identidad a unas iniciales.
 *
 * Sin este filtro "Pay de Queso" sería "PD" y "Tacos al Pastor" "TA": dos
 * siglas que no distinguen nada en una rejilla de veintidós tarjetas.
 */
const INITIALS_STOP_WORDS = new Set([
    "a", "al", "con", "de", "del", "el", "en", "la", "las", "los", "y",
]);

/**
 * Iniciales para usar cuando el producto no tiene foto.
 *
 * Dos letras: la de las dos primeras palabras con peso ("Hamburguesa Doble
 * BBQ" → "HD"), o las dos primeras del nombre si es de una sola palabra
 * ("Capuchino" → "CA"). Nunca devuelve vacío — un hueco sin nada rompería la
 * rejilla más que una interrogación.
 */
export function getProductInitials(name: string): string {
    const words = name
        .split(/[\s/·-]+/)
        .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ""))
        .filter(Boolean);

    // Si todo el nombre son conectores ("De la casa"), mejor las iniciales
    // literales que un "?".
    const meaningful = words.filter(
        (word) => !INITIALS_STOP_WORDS.has(word.toLowerCase())
    );
    const [first, second] = meaningful.length > 0 ? meaningful : words;

    if (!first) return "?";

    return (second ? first.slice(0, 1) + second.slice(0, 1) : first.slice(0, 2))
        .toUpperCase();
}

/** `Sin ingredientes` · `1 ingrediente` · `9 ingredientes` */
export const formatIngredients = (count: number): string =>
    formatPlural(messages.products.ingredients, count);
