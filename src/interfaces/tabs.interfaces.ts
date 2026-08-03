export interface FilterTabItem {
    /** Identificador que viaja al `onChange` (no se muestra). */
    value: string;
    label: string;
    /** Contador a la derecha de la etiqueta. Omítelo para no mostrarlo. */
    count?: number;
}

export interface FilterTabsProps {
    items: FilterTabItem[];
    /** Pestaña activa (modo controlado). */
    value: string;
    onChange: (value: string) => void;
    /** Nombre accesible del grupo, ej. "Categorías de productos". */
    label: string;
    /** `id` del contenido que gobiernan las pestañas (`role="tabpanel"`). */
    panelId?: string;
    className?: string;
}
