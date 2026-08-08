/**
 * Textos genéricos
 *
 * Lo que dice la aplicación sin que importe en qué módulo esté: el rótulo de
 * un botón de guardar, el aviso de que algo está cargando, la marca de los
 * campos obligatorios.
 *
 * El criterio para que un texto entre aquí es que **el mismo texto** sirva en
 * dos módulos distintos. No basta con que la palabra se repita: "Crear" a
 * secas es genérico, pero "Crear categoría" pertenece a productos aunque
 * empiece igual. Traducir esa distinción mal tiene un coste concreto — un
 * `common.actions.create` usado como "Crear categoría" se rompe en cuanto un
 * idioma ponga el verbo detrás del sustantivo.
 *
 * Lo que **no** entra: los textos por defecto de un componente del design
 * system (van en `components.messages.ts`, que es el catálogo de esa familia)
 * y cualquier frase que nombre un concepto del negocio.
 */


export const common = {

    /* ── Acciones ───────────────────────────────────────────────────────── */
    // Rótulos de botón. Verbos en infinitivo y sin objeto: el objeto lo pone el
    // módulo cuando la acción necesita nombrarlo.

    actions: {
        create: "Crear",
        save: "Guardar",
        saveChanges: "Guardar cambios",
        edit: "Editar",
        delete: "Eliminar",
        cancel: "Cancelar",
        close: "Cerrar",
        confirm: "Confirmar",
        back: "Atrás",
        continue: "Continuar",
        retry: "Volver a intentarlo",
        clearFilters: "Limpiar filtros",
        viewAll: "Ver todos",
        change: "Cambiar",
        remove: "Quitar",
        selectFile: "Seleccionar archivo",
    },


    /* ── Estados de una vista ───────────────────────────────────────────── */
    // Lo que se enseña mientras no hay contenido que enseñar. Cada uno describe
    // una situación distinta y no son intercambiables: una lista vacía porque
    // está cargando, porque falló la red o porque el filtro no encontró nada
    // piden reacciones opuestas de quien mira.

    states: {
        loading: "Cargando…",
        noResults: "Sin resultados",
    },


    /* ── Formularios ────────────────────────────────────────────────────── */

    forms: {
        requiredFields: "Los campos marcados con * son obligatorios.",
        optional: "Opcional",
    },
} as const;
