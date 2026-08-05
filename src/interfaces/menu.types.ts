import { IconToken } from "@/tokens";

export interface MenuStructureDefault {
    title: string;
    type: string;
    orden: number;
    active: boolean;
};


/**
 * Tercer nivel del menú: siempre es una página final, nunca agrupa más items.
 * Se pinta como texto colgado del riel vertical del item padre (sin icono).
 */
export interface MenuStructureSubItem extends MenuStructureDefault {
    url: string;
};


export interface MenuStructureItems extends MenuStructureDefault {
    /** Ausente cuando el item sólo agrupa sub-items: entonces actúa como acordeón. */
    url?: string;
    icon: IconToken;
    /** Sub-items (tercer nivel). Su presencia es lo que muestra el chevron. */
    items?: MenuStructureSubItem[];
};


export interface MenuStructurePrimary extends MenuStructureDefault {
    items: MenuStructureItems[];
};
