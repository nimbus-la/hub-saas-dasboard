/**
 * Textos por defecto del design system
 *
 * Lo que dice un componente de `src/components/` cuando quien lo usa no le
 * dice nada. Son casi todos etiquetas accesibles —el nombre de la equis de un
 * modal, el de la flecha de una paginación— y valores por defecto de props.
 *
 * Van agrupados por familia de componente y no por tipo de texto, porque la
 * pregunta que se hace delante de este archivo siempre es la misma: "¿qué dice
 * el `DataTable` cuando no hay filas?". Es el mismo criterio con el que
 * `@/tokens` agrupa las recetas.
 *
 * Un texto que sólo existe porque una pantalla se lo pasa al componente no
 * está aquí: eso pertenece a la pantalla. Aquí sólo lo que el componente dice
 * por su cuenta.
 */

import type { Plural } from "../../types";


export const components = {

    /* ── Avisos ─────────────────────────────────────────────────────────── */

    alert: {
        close: "Cerrar aviso",
    },


    /* ── Diálogos ───────────────────────────────────────────────────────── */

    modal: {
        close: "Cerrar",
    },

    confirmDialog: {
        cancel: "Cancelar",
    },


    /* ── Formularios ────────────────────────────────────────────────────── */

    textField: {
        clear: "Limpiar campo",
        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",
    },

    inputSelector: {
        placeholder: "Selecciona una opción",
        empty: "Sin resultados",
    },


    /* ── Tablas ─────────────────────────────────────────────────────────── */

    dataTable: {
        empty: "Aún no hay registros para mostrar.",
        selectAllRows: "Seleccionar todas las filas",
        selectRow: "Seleccionar fila",
    },


    /* ── Paginación ─────────────────────────────────────────────────────── */

    pagination: {
        label: "Paginación",

        /**
         * Resumen de lo que se está viendo.
         *
         * El rango llega ya compuesto (`1–12`) en lugar de como dos huecos: el
         * guión que los une es una raya corta, no un guión de teclado, y
         * repartirlo entre plantilla y llamada era la forma segura de que
         * alguien escribiera el equivocado.
         */
        summary: "Mostrando {range} de {total} {items}",

        pageSize: "Por página",
        previousPage: "Página anterior",
        nextPage: "Página siguiente",
        page: "Página {page}",

        /** Cómo se llama lo que se pagina cuando quien la usa no lo dice. */
        items: {
            one: "resultado",
            other: "resultados",
        } satisfies Plural,
    },


    /* ── Tarjetas ───────────────────────────────────────────────────────── */

    metricCard: {
        deltaLabel: "vs. mes anterior",
    },

    /**
     * Tarjeta de producto.
     *
     * Vive en el catálogo de componentes y no en el de productos porque es un
     * componente del sistema (`src/components/cards/`) y estos textos son sus
     * valores por defecto: los pinta sin que ninguna pantalla se los pase.
     *
     * Las etiquetas accesibles nombran el producto en lugar de decir sólo la
     * acción: veinte botones "Editar" seguidos en una rejilla no se distinguen
     * entre sí al recorrer la lista de controles de un lector de pantalla, y
     * por eso empiezan por el texto visible (WCAG 2.5.3).
     */
    productCard: {
        edit: "Editar",
        editProduct: "Editar {name}",
        deleteProduct: "Eliminar {name}",
        pricePrefix: "Precio: ",
        alertPrefix: "Alerta: ",
    },
} as const;
