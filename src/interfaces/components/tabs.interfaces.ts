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
    /**
     * Si hay más pestañas por traer y se pueden pedir ahora. Apágalo mientras
     * llega una tanda, igual que con `useInfiniteScroll`.
     */
    canLoadMore?: boolean;
    /** Se llama cuando el final del carril se acerca a la vista. */
    onLoadMore?: () => unknown;
    /** Muestra una pestaña fantasma al final mientras llega la siguiente tanda. */
    isLoadingMore?: boolean;
    className?: string;
}
