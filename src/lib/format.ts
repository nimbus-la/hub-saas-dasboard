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
 * Los separadores de miles y de decimales del idioma de la interfaz. En
 * es-CO son `.` y `,`.
 *
 * Se sacan de `Intl` formateando un número de ejemplo, así un cambio de país
 * no obliga a buscar los separadores escritos a mano por todo el proyecto.
 */
const numberParts = numberFormatter.formatToParts(10000.5);

export const NUMBER_SEPARATORS = {
    group: numberParts.find((part) => part.type === "group")?.value ?? ".",
    decimal: numberParts.find((part) => part.type === "decimal")?.value ?? ",",
} as const;

/**
 * Interpreta un número pegado desde otro lugar, como una hoja de cálculo.
 *
 * Lo que se pega puede venir con el formato de Colombia (`1.234,56`) o con el
 * de Estados Unidos (`1,234.56`), así que no basta con saber cuál separador
 * usa la interfaz. Se decide así:
 *
 * - Si trae punto y coma, el que aparece al final es el decimal.
 * - Si un separador se repite, como en `1.234.567`, son miles.
 * - Si solo hay un separador y lo siguen exactamente tres dígitos, como en
 *   `1.234` o `15,678`, son miles, porque con un máximo de dos decimales no
 *   podría ser un decimal. La excepción es cuando antes solo hay un cero,
 *   como en `0,001`. En cualquier otro caso es el decimal.
 *
 * Se quita todo lo que no sea número, como espacios o el símbolo `$`. Si
 * sobran decimales se cortan, igual que pasa al escribirlos. Devuelve `null`
 * si no queda ningún dígito.
 */
export function parsePastedNumber(
    text: string,
    { maxDecimals, allowNegative }: { maxDecimals: number; allowNegative: boolean }
): number | null {
    const isNegative = allowNegative && text.trim().startsWith("-");
    const cleaned = text.replace(/[^\d.,]/g, "");

    if (!/\d/.test(cleaned)) return null;

    const lastDot = cleaned.lastIndexOf(".");
    const lastComma = cleaned.lastIndexOf(",");

    let decimalIndex = -1;

    if (lastDot !== -1 && lastComma !== -1) {
        decimalIndex = Math.max(lastDot, lastComma);
    } else {
        const separatorIndex = Math.max(lastDot, lastComma);
        const separator = cleaned[separatorIndex];
        const isRepeated = separator !== undefined && cleaned.indexOf(separator) !== separatorIndex;
        const digitsAfter = cleaned.length - separatorIndex - 1;
        // Un número con miles nunca empieza en cero, así que `0,001` es decimal.
        const startsWithZero = /^0*$/.test(cleaned.slice(0, separatorIndex));
        const looksLikeThousands = digitsAfter === 3 && maxDecimals < 3 && !startsWithZero;

        if (separatorIndex !== -1 && !isRepeated && !looksLikeThousands) {
            decimalIndex = separatorIndex;
        }
    }

    const integerPart = (decimalIndex === -1 ? cleaned : cleaned.slice(0, decimalIndex)).replace(/\D/g, "");
    const decimalPart = decimalIndex === -1
        ? ""
        : cleaned.slice(decimalIndex + 1).replace(/\D/g, "").slice(0, maxDecimals);

    const parsed = Number(`${integerPart || "0"}${decimalPart ? `.${decimalPart}` : ""}`);

    if (!Number.isFinite(parsed)) return null;

    return isNegative ? -parsed : parsed;
}

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
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Bogota",
});

export const formatDate = (value: Date | string | number): string =>
    dateFormatter.format(value instanceof Date ? value : new Date(value));

// ── Enumeraciones ───────────────────────────────────────────────────────────

/**
 * Convierte una lista en una frase, por ejemplo `["A", "B", "C"]` queda como
 * `A, B y C`.
 *
 * Usamos `Intl.ListFormat` en lugar de un `join(", ")` porque la conjunción
 * cambia según el idioma, y hasta en español la "y" pasa a ser "e" cuando la
 * siguiente palabra empieza por i.
 */
const listFormatter = new Intl.ListFormat(LOCALE, {
    style: "long",
    type: "conjunction",
});

export const formatList = (items: readonly string[]): string =>
    listFormatter.format(items);
