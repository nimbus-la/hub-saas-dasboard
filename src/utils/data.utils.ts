import { MenuStructurePrimary } from "@/interfaces";
import { messages } from "@/messages";

/**
 * Estructura del menú lateral.
 *
 * Aquí se decide qué cuelga de qué, con qué icono y hacia qué ruta. Los
 * rótulos no se escriben: salen de `@/messages`, porque la estructura no se
 * traduce y el texto sí — mantener las dos cosas juntas obligaría a duplicar
 * el árbol entero por idioma para cambiar seis palabras.
 */
const { sections, items } = messages.navigation.menu;

export const DATA_MENU: MenuStructurePrimary[] = [
    {
        title: sections.general,
        orden: 1,
        type: 'primary',
        active: true,
        items: [
            {
                orden: 1,
                title: items.home,
                type: 'secondary',
                icon: 'DASHBOARD',
                url: '/',
                active: true,
            }
        ]
    },
    {
        title: sections.management,
        orden: 2,
        type: 'primary',
        active: true,
        items: [
            {
                orden: 1,
                title: items.products,
                type: 'secondary',
                icon: 'PRODUCTS',
                // Sin `url`: actúa como acordeón, sus hijos son las páginas reales.
                active: true,
                items: [
                    {
                        orden: 1,
                        title: items.categories,
                        type: 'tertiary',
                        url: '/products/categories',
                        active: true,
                    },
                    {
                        orden: 2,
                        title: items.productsList,
                        type: 'tertiary',
                        url: '/products',
                        active: true,
                    },
                    {
                        orden: 3,
                        title: items.createProduct,
                        type: 'tertiary',
                        url: '/products/create',
                        active: true,
                    },
                ],
            },
            {
                orden: 2,
                title: items.inventory,
                type: 'secondary',
                icon: 'INVENTORY',
                url: '/invetory',
                active: true,
            },
            {
                orden: 3,
                title: items.orders,
                type: 'secondary',
                icon: 'ORDERS',
                url: '/orders',
                active: true,
            },
            {
                orden: 4,
                title: items.employees,
                type: 'secondary',
                icon: 'EMPLEOYES',
                url: '/empleoyes',
                active: true,
            }
        ]
    }
]
