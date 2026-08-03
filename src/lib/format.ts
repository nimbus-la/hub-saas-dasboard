// ── Formatos de la aplicación (es-CO / COP) ─────────────────────────────────
// Punto único donde se decide cómo se ve un número, un importe, un porcentaje
// o una fecha. Ningún componente ni módulo de datos debe crear su propio
// `Intl.*` ni llamar a `toLocaleString`: si la moneda o el país cambian, se
// cambia aquí y la app entera sigue.
//
// Los formateadores se instancian una sola vez a nivel de módulo porque crear
// un `Intl.NumberFormat` es caro y estas funciones se llaman por celda, por
// tarjeta y por marca del eje de una gráfica.

/** País e idioma de la interfaz. Lo consumen los formateadores de abajo. */
export const LOCALE = "es-CO";

/** Moneda de todos los importes de la aplicación. */
export const CURRENCY = "COP";

/**
 * Separador que el CLDR usa entre el símbolo y la cifra (`$ 28.000`).
 *
 * Es un espacio duro, no uno normal: evita que el importe se parta en dos
 * líneas justo después del `$`.
 */
const NBSP = " ";

// ── Números y porcentajes ───────────────────────────────────────────────────

const numberFormatter = new Intl.NumberFormat(LOCALE);

const percentFormatter = new Intl.NumberFormat(LOCALE, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
});

/** Cantidad con separador de miles: `3.184` */
export const formatNumber = (value: number): string => numberFormatter.format(value);

/**
 * Porcentaje ya calculado sobre 100: `formatPercent(27.3)` → `27,3%`.
 *
 * Recibe la cifra tal como se lee ("27,3 por ciento"), no la fracción: casi
 * todos los cálculos de la app la producen ya multiplicada.
 */
export const formatPercent = (percentage: number): string =>
    percentFormatter.format(percentage / 100);

// ── Dinero ──────────────────────────────────────────────────────────────────

const MILLION = 1_000_000;

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
    style: "currency",
    currency: CURRENCY,
    // El peso colombiano no se maneja en centavos: dos decimales en cada
    // importe son ruido, y en una tabla desalinean la columna.
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat(LOCALE, {
    notation: "compact",
    maximumFractionDigits: 1,
});

/** Importe completo: `$ 28.000` · `$ 1.250.000` */
export const formatCurrency = (amount: number): string =>
    currencyFormatter.format(amount);

/**
 * Importe abreviado para ejes de gráficas y métricas: `$ 850 K` · `$ 500 M`.
 *
 * Dos correcciones sobre lo que devuelve el CLDR de es-CO:
 *
 *   · El sufijo se normaliza a mayúscula: alterna `K` y `k` según la magnitud
 *     y en un mismo eje se acaban viendo las dos.
 *   · Por encima de mil millones sigue usando `M` y produce `6530,2 M` —cuatro
 *     dígitos sin separador—, así que a partir de ahí se abrevia a mano en
 *     millones. Leyenda y eje conservan la misma unidad, que es lo que permite
 *     compararlos sin convertir mentalmente.
 */
export const formatCurrencyCompact = (amount: number): string => {
    if (Math.abs(amount) >= 1_000 * MILLION) {
        return `$${NBSP}${formatNumber(Math.round(amount / MILLION))}${NBSP}M`;
    }

    return `$${NBSP}${compactFormatter.format(amount).replace(/k$/, "K")}`;
};

// ── Fechas ──────────────────────────────────────────────────────────────────

/**
 * Fecha corta: `28/07/2026`.
 *
 * Se formatea en UTC a propósito para que servidor y cliente coincidan: con la
 * zona horaria del navegador, una fecha guardada a medianoche se renderiza un
 * día distinto en cada lado y React reporta un fallo de hidratación.
 */
const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
});

export const formatDate = (value: Date | string | number): string =>
    dateFormatter.format(value instanceof Date ? value : new Date(value));
