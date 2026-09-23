// ── Sucursales ──────────────────────────────────────────────────────────────
// Datos de prueba mientras no exista el endpoint de sucursales. Cuando llegue,
// basta con cambiar `getBranches` y `getBranch` por el servicio manteniendo la
// misma forma de los datos.
//
// Vive aquí y no dentro del mock de ventas porque ya no es solo el eje de una
// gráfica: el alta de producto necesita la misma lista para dejar que cada
// sucursal fije su propio precio.

/** Id que representa "todas las sucursales" en los filtros. */
export const ALL_BRANCHES = "todas";


export interface Branch {
    id: string;
    name: string;
    /** Hex del token correspondiente en `style.css`, para las gráficas. */
    color: string;
}


export const BRANCHES: Branch[] = [
    { id: "centro", name: "Sucursal Centro", color: "#22C55E" }, // success-main
    { id: "norte", name: "Sucursal Norte", color: "#FFAB00" }, // warning-main
    { id: "sur", name: "Sucursal Sur", color: "#00B8D9" }, // info-main
    { id: "plaza", name: "Sucursal Plaza", color: "#8E33FF" }, // secondary-main
];


export function getBranches(): Branch[] {
    return BRANCHES;
}


/** Devuelve la sucursal con ese id, o nada si ya no está en el catálogo. */
export function getBranch(id: string): Branch | undefined {
    return BRANCHES.find((branch) => branch.id === id);
}
