/**
 * Textos del módulo de productos
 *
 * Todo lo que se lee en el catálogo, en el alta por pasos y en la pantalla de
 * categorías: títulos, rótulos de campo, mensajes de validación, estados
 * vacíos y las etiquetas accesibles de sus controles.
 *
 * El reparto interno sigue al de las pantallas —`list`, `create`,
 * `categories`— y no al tipo de texto. Buscar aquí siempre empieza por "¿en
 * qué pantalla se lee esto?", que es la pregunta que uno se hace mirando la
 * interfaz; un bloque `titles` con los títulos de las tres pantallas juntos
 * obligaría a saber la respuesta antes de buscarla.
 *
 * Los mensajes de validación viven con su pantalla y no en un bloque aparte
 * porque el número que los provoca y el texto que lo explica tienen que viajar
 * juntos: un `max: 40` en las reglas y un "no puede pasar de 40" en otro
 * archivo se desincronizan al primer cambio. Por eso el límite entra como
 * hueco `{max}` en lugar de escrito a mano — las reglas lo inyectan desde la
 * constante que además usa el contador del campo.
 */

import type { Plural } from "../../types";


export const products = {

    /* ====================================================================== */
    /*  Metadatos de las rutas                                                */
    /* ====================================================================== */
    // Lo que se ve en la pestaña del navegador y en una vista previa
    // compartida. No aparece en la interfaz, pero es texto de cara al público
    // igual que el resto.

    metadata: {
        list: {
            title: "Productos · Vorea",
            description: "Catálogo de productos de tus sucursales.",
        },
        create: {
            title: "Nuevo producto · Vorea",
            description: "Añade un producto a la carta de tus sucursales.",
        },
        categories: {
            title: "Categorías · Vorea",
            description: "Secciones en las que se agrupa la carta de tus sucursales.",
        },
    },


    /* ====================================================================== */
    /*  Dominio                                                               */
    /* ====================================================================== */
    // Textos que acompañan a un producto se pinte donde se pinte: tarjeta,
    // tabla o detalle. Están fuera de las pantallas justo para que las tres lo
    // digan igual.

    /**
     * Estado operativo del producto.
     *
     * Las claves son los valores que publica el backend, no traducciones: el
     * día que llegue el inglés cambia el rótulo, no la clave.
     */
    status: {
        disponible: "Disponible",
        "stock-bajo": "Stock bajo",
        "no-disponible": "No disponible",
        inactivo: "Inactivo",
    },

    /** `1 producto` · `22 productos` */
    count: {
        one: "{count} producto",
        other: "{count} productos",
    } satisfies Plural,

    /**
     * `Sin ingredientes` · `1 ingrediente` · `9 ingredientes`
     *
     * El cero tiene frase propia: "0 ingredientes" en una tarjeta se lee como
     * un dato que falta, y lo que dice es que la receta está vacía.
     */
    ingredients: {
        zero: "Sin ingredientes",
        one: "{count} ingrediente",
        other: "{count} ingredientes",
    } satisfies Plural,


    /* ====================================================================== */
    /*  Catálogo                                                              */
    /* ====================================================================== */

    list: {
        title: "Productos",
        description:
            "Gestiona la carta de tus sucursales y avisa al equipo cuando falte un insumo.",
        createProduct: "Crear producto",

        searchPlaceholder: "Buscar por nombre o categoría",
        searchLabel: "Buscar productos",

        tabsLabel: "Categorías de productos",
        /** Pestaña que no filtra por categoría. */
        allCategories: "Todas",

        /**
         * Nombre accesible de la rejilla.
         *
         * Nombra la categoría que se está viendo porque el panel cambia de
         * contenido sin cambiar de página: sin esto, quien navega con lector
         * de pantalla no tiene forma de saber qué pestaña ganó.
         */
        panelLabel: "Productos de {category}",
        /** Lo que ocupa `{category}` cuando no hay filtro puesto. */
        allCategoriesLabel: "todas las categorías",

        /** Cómo se llama lo que se pagina, en el pie del listado. */
        itemLabel: {
            one: "producto",
            other: "productos",
        } satisfies Plural,

        /**
         * Callejón sin salida.
         *
         * Además de decir que no hay nada, repite qué se buscó —para que se vea
         * la errata— y ofrece la salida. Las dos versiones no son la misma
         * frase con un adorno: sin búsqueda el problema es que la categoría
         * está vacía, y limpiar filtros no lo arregla.
         */
        empty: {
            title: "No encontramos productos",
            withQuery:
                "Ningún producto de esta categoría coincide con “{query}”. Revisa la escritura o prueba con otro término.",
            withoutQuery: "Esta categoría todavía no tiene productos en la carta.",
        },
    },


    /* ====================================================================== */
    /*  Alta de producto                                                      */
    /* ====================================================================== */

    create: {
        title: "Nuevo producto",
        subtitle:
            "Completa los 3 pasos para publicar el producto. Nada se publicará hasta el último paso.",
        backLabel: "Volver a la lista de productos",

        submit: "Guardar producto",
        /** Por qué el botón de guardar está apagado en el último paso. */
        cannotSaveYet:
            "Podrás guardar el producto cuando los tres pasos estén disponibles.",

        /* ── Indicador de pasos ─────────────────────────────────────────── */

        stepperLabel: "Progreso del alta de producto",

        /** `Paso 1 de 3` — para el resumen accesible y las pantallas estrechas. */
        stepPosition: "Paso {current} de {total}",

        /**
         * Rótulo y contenido de cada paso.
         *
         * El rótulo es corto porque en móvil comparte fila con otros dos; la
         * pista dice qué se pide y sólo se ve a partir de pantallas grandes.
         */
        steps: {
            basics: {
                label: "Datos básicos",
                hint: "Nombre, categoría e imagen",
            },
            pricing: {
                label: "Precio y disponibilidad",
                hint: "Precio de venta y estado en la carta",
            },
            recipe: {
                label: "Receta e insumos",
                hint: "Ingredientes que componen el plato",
            },
        },

        /** Pasos definidos pero todavía sin campos. */
        placeholder: {
            title: "{position} · {label}",
            message:
                "Aquí se pedirá: {hint}. Estamos construyendo este paso; mientras tanto, lo que escribiste en los anteriores se conserva.",
        },

        /* ── Paso 1: datos básicos ──────────────────────────────────────── */

        basics: {
            /** Nombre del grupo de campos. No se ve: en pantalla lo da el indicador. */
            legend: "Datos básicos del producto",

            name: {
                label: "Nombre del producto",
                placeholder: "Ej. Hamburguesa doble BBQ",
                helper: "Así aparecerá en la carta y en la comanda de cocina.",
            },
            category: {
                label: "Categoría",
                placeholder: "Selecciona una categoría",
                helper: "Define la sección de la carta en la que se agrupa.",
                empty: "Ninguna categoría coincide",
            },
            description: {
                label: "Descripción",
                placeholder:
                    "Ej. Doble carne de res a la parrilla, queso cheddar, cebolla caramelizada y salsa BBQ de la casa.",
            },
        },

        /* ── Foto ───────────────────────────────────────────────────────── */

        image: {
            label: "Imagen del producto",
            hint: "Se publica en la carta y en el catálogo; mientras no la subas, el producto se muestra con las iniciales de su nombre.",

            dropzoneTitle: "Arrastra la foto aquí o búscala en tu equipo",
            dropzoneCaption: "{formats} · hasta {max} · se recorta en cuadrado",

            /** `PNG, JPG o WEBP` — los formatos aceptados, en prosa. */
            formats: "PNG, JPG o WEBP",
            ready: "Listo para publicar",

            /**
             * Por qué se rechazó el archivo.
             *
             * Dicen qué pasó y cómo arreglarlo. Un "archivo no válido" deja a
             * quien lo lee probando formatos a ciegas.
             */
            invalidType:
                "Ese formato no se puede publicar. Sube la foto en {formats}.",
            tooLarge:
                "La foto pesa {size} y el máximo son {max}. Redúcela e inténtalo de nuevo.",
        },

        /* ── Validación ─────────────────────────────────────────────────── */
        // Dicen siempre qué falta y qué hacer. "Campo obligatorio" no es un
        // mensaje de error, es una etiqueta.

        validation: {
            nameRequired: "Escribe el nombre con el que se venderá el producto.",
            nameMax: "El nombre no puede pasar de {max} caracteres.",
            nameMin: "El nombre necesita al menos {min} caracteres.",
            categoryRequired: "Elige la categoría en la que se agrupa dentro de la carta.",
            descriptionMax: "La descripción supera los {max} caracteres.",
        },
    },


    /* ====================================================================== */
    /*  Categorías                                                            */
    /* ====================================================================== */

    categories: {
        title: "Categorías",
        subtitle:
            "Agrupa la carta en secciones. Desactivar una categoría la retira del menú sin borrar sus productos.",
        backLabel: "Volver a la lista de productos",

        /** `1 categoría` · `8 categorías` */
        count: {
            one: "{count} categoría",
            other: "{count} categorías",
        } satisfies Plural,

        /**
         * Qué dice la tabla cuando no pinta filas.
         *
         * Son cuatro situaciones y la diferencia importa: cargando, la API
         * falló, no hay catálogo, o el filtro no encontró nada. Un único "sin
         * resultados" para las cuatro es el camino corto a que alguien dé por
         * perdidas sus categorías durante un corte de red.
         */
        loading: "Cargando categorías…",
        loadError: "No se pudieron cargar las categorías.",
        emptyCatalog:
            "Todavía no hay categorías. Crea la primera para empezar a agrupar la carta.",
        emptyFiltered:
            "Ninguna categoría coincide con la búsqueda. Prueba con otro texto o cambia el filtro de estado.",

        saveError: "No se pudo guardar la categoría.",

        /* ── Estado ─────────────────────────────────────────────────────── */
        // Las claves nombran el estado y no el valor del campo: un
        // `status.true` obligaría a leer el tipo para saber qué significa.

        status: {
            active: "Activa",
            inactive: "Inactiva",
        },

        /* ── Barra de filtros ───────────────────────────────────────────── */

        toolbar: {
            searchPlaceholder: "Buscar por nombre o descripción",
            searchLabel: "Buscar categorías",

            filterLabel: "Filtrar categorías por estado",
            /** Opción del filtro que no filtra. Es un valor, no la ausencia de uno. */
            allStatuses: "Todos los estados",
            filterEmpty: "Ningún estado coincide",

            create: "Crear categoría",

            /** `3 categorías de 8` — cuántas quedan tras filtrar. */
            summary: "{visible} de {total}",
        },

        /* ── Tabla ──────────────────────────────────────────────────────── */

        table: {
            name: "Nombre",
            description: "Descripción",
            status: "Estado",
            updatedAt: "Fecha de actualización",

            /**
             * Huecos de la tabla.
             *
             * La raya se ve; esto es lo que se oye. Sin la etiqueta, un lector
             * de pantalla anuncia un guión suelto y quien lo escucha no sabe si
             * falta el dato o falló la carga.
             */
            noDescription: "Sin descripción",
            noUpdatedAt: "Sin fecha de actualización",

            /**
             * Acciones de fila.
             *
             * La etiqueta accesible nombra la categoría y no sólo la acción:
             * con ocho filas iguales, ocho botones que dicen "Editar" no se
             * distinguen entre sí al navegar por la lista de controles.
             */
            edit: "Editar",
            editCategory: "Editar {name}",
            delete: "Eliminar",
            deleteCategory: "Eliminar {name}",
        },

        /* ── Alta y edición ─────────────────────────────────────────────── */

        form: {
            /**
             * Los dos modos del modal.
             *
             * Comparten campos y reglas, y se diferencian sólo en lo que dicen
             * y en si enseñan el interruptor. Tenerlos en una tabla evita el
             * `isEdit ? … : …` repetido cinco veces dentro del JSX.
             */
            create: {
                title: "Nueva categoría",
                description:
                    "Agrupa productos de la carta bajo un nombre. Podrás asignarle productos después.",
                submit: "Crear categoría",
            },
            edit: {
                title: "Editar categoría",
                description:
                    "Cambia el nombre, la descripción o retírala de la carta sin perder sus productos.",
                submit: "Guardar cambios",
            },

            close: "Cerrar el formulario de categoría",

            name: {
                label: "Nombre",
                placeholder: "Ej. Bebidas calientes",
                helper: "Así aparecerá como sección de la carta.",
            },
            description: {
                label: "Descripción",
                placeholder: "Ej. Cafés, tés e infusiones preparados al momento.",
                helper: "Opcional. Una frase de apoyo bajo el nombre de la sección.",
            },

            activeLabel: "Categoría activa",
            /** Qué pasa con los productos al mover el interruptor. */
            activeHint: {
                on: "Se muestra en la carta y en el filtro del catálogo.",
                off: "Se oculta de la carta. Sus productos no se borran.",
            },
        },

        /* ── Validación ─────────────────────────────────────────────────── */

        validation: {
            nameRequired: "Escribe el nombre con el que aparecerá en la carta.",
            nameMax: "El nombre no puede pasar de {max} caracteres.",
            nameMin: "El nombre necesita al menos {min} caracteres.",
            descriptionMax: "La descripción supera los {max} caracteres.",
            /** El nombre repetido lo detecta la pantalla, que tiene la lista entera. */
            nameTaken: 'Ya existe una categoría llamada "{name}". Usa otro nombre.',
        },

        /* ── Borrado ────────────────────────────────────────────────────── */

        delete: {
            title: "Eliminar categoría",
            confirm: "Eliminar",
            cancel: "Cancelar",

            /**
             * Qué se pierde al borrar.
             *
             * Nombra la categoría en lugar de decir "esta categoría": el
             * diálogo se abre desde una fila cualquiera de una tabla de ocho
             * iguales, y quien pulsa quiere comprobar que apuntó a la correcta.
             *
             * Y ofrece la salida buena. Desactivar es lo que se quiere hacer
             * nueve de cada diez veces, así que el diálogo lo dice justo donde
             * alguien está a punto de borrar por no saber que existía.
             */
            description:
                "Se eliminará «{name}» y sus productos quedarán sin categoría. Si solo quieres retirarla de la carta, desactívala en su lugar.",
        },
    },
} as const;
