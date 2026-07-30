import { IconToken } from "@/tokens";

export interface MenuStructureDefault {
    title: string;
    type: string;
    orden: number;
    active: boolean;
};


export interface MenuStructureItems extends MenuStructureDefault {
    url: string;
    icon: IconToken;
};


export interface MenuStructurePrimary extends MenuStructureDefault {
    items: MenuStructureItems[];
};