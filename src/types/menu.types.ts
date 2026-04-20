export interface MenuStructureDefault {
    title: string;
    type: string;
    orden: number;
    active: boolean;
};


export interface MenuStructureItems extends MenuStructureDefault {
    url: string;
    icon: string;
};


export interface MenuStructurePrimary extends MenuStructureDefault {
    items: MenuStructureItems[];
};