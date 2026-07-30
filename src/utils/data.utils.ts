import { MenuStructurePrimary } from "@/interfaces";

export const DATA_MENU: MenuStructurePrimary[] = [
    {
        title: 'GENERAL',
        orden: 1,
        type: 'primary',
        active: true,
        items: [
            {
                orden: 1,
                title: 'Inicio',
                type: 'secondary',
                icon: 'DASHBOARD',
                url: '/',
                active: true,
            }
        ]
    },
    {
        title: 'GESTIÓN',
        orden: 2,
        type: 'primary',
        active: true,
        items: [
            {
                orden: 1,
                title: 'Productos',
                type: 'secondary',
                icon: 'PRODUCTS',
                url: '/products',
                active: true,
            },
            {
                orden: 2,
                title: 'Inventario',
                type: 'secondary',
                icon: 'INVENTORY',
                url: '/invetory',
                active: true,
            },
            {
                orden: 3,
                title: 'Ordenes',
                type: 'secondary',
                icon: 'ORDERS',
                url: '/orders',
                active: true,
            },
            {
                orden: 4,
                title: 'Empleados',
                type: 'secondary',
                icon: 'EMPLEOYES',
                url: '/empleoyes',
                active: true,
            }
        ]
    }
]