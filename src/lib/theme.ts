// ── Puente entre los tokens de style.css y las APIs que no usan clases ──────
// Canvas (Chart.js), degradados y cualquier cosa que necesite el color como
// string no puede leer utilidades de Tailwind. Estos helpers resuelven los
// tokens en tiempo de ejecución para no duplicar valores hex por el código.

/**
 * Lee una custom property del tema declarada en `:root`.
 *
 * SOLO en cliente: usa `getComputedStyle`, así que debe llamarse dentro de un
 * efecto o de un manejador de eventos. Llamarla durante el render rompería la
 * hidratación (el servidor no tiene DOM).
 */
export function readCssVariable(variableName: string, fallback: string): string {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue(variableName)
        .trim();

    return value || fallback;
}

/**
 * Convierte un color hexadecimal (`#RRGGBB` o `#RGB`) a `rgba()`, para aplicar
 * transparencias sobre canvas donde no existen las variantes `/opacity`.
 */
export function hexToRgba(hex: string, alpha: number): string {
    const normalizedHex = hex.replace("#", "");

    // La forma corta (#ABC) duplica cada dígito para llegar a 6.
    const expandedHex =
        normalizedHex.length === 3
            ? normalizedHex
                .split("")
                .map((digit) => digit + digit)
                .join("")
            : normalizedHex;

    const rgbValue = parseInt(expandedHex, 16);
    const red = (rgbValue >> 16) & 255;
    const green = (rgbValue >> 8) & 255;
    const blue = rgbValue & 255;

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
