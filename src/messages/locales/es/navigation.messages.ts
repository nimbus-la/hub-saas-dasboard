/**
 * Textos del armazón y de la navegación
 *
 * La marca, la barra superior, el menú lateral y los rótulos de sus entradas.
 * Es lo primero que se lee en cualquier pantalla y lo único que no cambia al
 * cambiar de módulo.
 *
 * Los rótulos del menú están aquí y no en `data.utils.ts` porque `DATA_MENU`
 * describe la **estructura** —qué cuelga de qué, con qué icono, hacia qué
 * ruta— y eso no se traduce. El texto sí, y mantenerlo mezclado con la
 * estructura obligaría a duplicar el árbol entero por idioma para cambiar seis
 * palabras.
 */


export const navigation = {

    /* ── Marca ──────────────────────────────────────────────────────────── */

    app: {
        name: "Vorea",
        description:
            "Panel de control para la gestión de sucursales, ventas e inventario.",
    },


    /* ── Menú lateral ───────────────────────────────────────────────────── */

    sidebar: {
        home: "Vorea — ir al inicio",
        primaryNav: "Navegación principal",
        collapse: "Colapsar menú lateral",
        expand: "Expandir menú lateral",
        close: "Cerrar menú",
    },


    /* ── Barra superior ─────────────────────────────────────────────────── */

    navbar: {
        label: "Barra superior",
        openMenu: "Abrir menú",
        branchPlaceholder: "Seleccionar sucursal",
        selectBranch: "Seleccionar sucursal",
        closeBranchSelector: "Cerrar selector de sucursal",
        notifications: "Ver notificaciones",
    },


    /* ── Entradas del menú ──────────────────────────────────────────────── */
    // Las claves nombran el concepto, no la ruta: `productsList` sigue
    // significando lo mismo si mañana la lista se mueve de `/products` a
    // `/catalog`. El orden y el anidamiento los decide `DATA_MENU`.

    menu: {
        sections: {
            general: "GENERAL",
            management: "GESTIÓN",
        },

        items: {
            home: "Inicio",
            products: "Productos",
            categories: "Categorías",
            productsList: "Lista de productos",
            createProduct: "Crear producto",
            inventory: "Inventario",
            orders: "Ordenes",
            employees: "Empleados",
        },
    },
} as const;
