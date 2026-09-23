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

    /**
     * Unidades de medida del inventario.
     *
     * Cada unidad tiene tres textos porque se muestra en sitios distintos. La
     * abreviatura va junto a una cifra (`1.200 g`), el plural se usa dentro de
     * una frase ("la cantidad en gramos") y el label sirve cuando la unidad
     * aparece sola, como en el rótulo de una columna.
     *
     * Las claves son los valores que envía el backend, así que no se traducen.
     */
    units: {
        gramo: { label: "Gramos", plural: "gramos", abbreviation: "g" },
        mililitro: { label: "Mililitros", plural: "mililitros", abbreviation: "ml" },
        unidad: { label: "Unidades", plural: "unidades", abbreviation: "u" },
    },


    /* ====================================================================== */
    /*  Catálogo                                                            */
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

        /** Lo que se anuncia al terminar el alta. */
        success: {
            title: "Producto creado",
            description: "«{name}» ya está en el catálogo.",
        },

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

        /* ── Paso 2: receta e insumos ───────────────────────────────────── */

        recipe: {
            /** Nombre del grupo de campos. No se ve: en pantalla lo da el indicador. */
            legend: "Receta e insumos del producto",

            /**
             * Existencias del insumo.
             *
             * Fuera de `search` y de `list` porque las dos lo dicen igual: la
             * cifra de stock significa lo mismo se mire donde se mire, y dos
             * copias de "Agotado" se acabarían separando en la primera
             * revisión de textos.
             */
            stock: {
                available: "disponible",
                outOfStock: "Agotado",
            },

            /* Buscador del inventario. */
            search: {
                label: "Buscar insumo",
                placeholder: "Escribe el nombre o el SKU del insumo",
                helper: "Añade lo que se consume al preparar una unidad del producto. Los insumos retirados del inventario no aparecen aquí.",

                /** Nombre accesible del panel de resultados. */
                resultsLabel: "Insumos encontrados",
                /** Lo que anuncia el lector de pantalla cuando aparecen resultados. */
                resultsCount: {
                    one: "{count} insumo encontrado",
                    other: "{count} insumos encontrados",
                } satisfies Plural,
                /**
                 * Lo que precede al contenido del resultado para quien lo oye.
                 *
                 * No es un `aria-label`: ése sustituiría a todo lo que la fila
                 * enseña —nombre, SKU, costo y existencias— por cuatro palabras.
                 * Va delante, en `sr-only`, para que el botón se anuncie como
                 * lo que hace **y** con lo que dice.
                 */
                add: "Añadir a la receta:",

                /**
                 * Cuando la búsqueda no devuelve nada.
                 *
                 * Repite el término tal y como se escribió —para que la errata se
                 * vea— y dice dónde mirar si el insumo debería existir.
                 */
                empty: "Ningún insumo del inventario coincide con «{query}». Revisa la escritura o dalo de alta en Inventario.",
                /** Cuando todo lo que coincide ya está en la receta. */
                allAdded: "Todos los insumos que coinciden con «{query}» ya están en la receta.",

                /** `de 24 · viendo 6` — qué parte del inventario se está viendo. */
                more: "Se muestran los {shown} primeros de {total}. Afina la búsqueda para ver el resto.",

                /** Costo por unidad de medida, en el resultado: `$ 32 / g`. */
                unitCost: "{cost} / {unit}",
            },

            /* Lista de insumos ya añadidos. */
            list: {
                /** `Insumos de la receta` — encabeza el bloque de la lista. */
                title: "Insumos de la receta",

                /**
                 * Rótulos de columna.
                 *
                 * Se ven en escritorio y se oyen siempre: en móvil la fila se
                 * apila y cada dato lleva su rótulo delante, porque una cifra
                 * suelta debajo de un nombre no dice si es lo que se usa o lo
                 * que queda.
                 */
                columns: {
                    ingredient: "Insumo",
                    quantity: "Cantidad",
                    stock: "Stock disponible",
                    optional: "Opcional",
                    actions: "Acciones",
                },

                /**
                 * Etiqueta accesible del interruptor de opcional. El lector de
                 * pantalla la lee junto con el estado, como "Pan brioche es
                 * opcional, activado".
                 */
                optionalLabel: "{name} es opcional",

                /** Etiqueta accesible del campo de cantidad. Nombra el insumo y su unidad. */
                quantityLabel: "Cantidad de {name} en {unit}",
                remove: "Quitar {name} de la receta",
                perishable: "Perecedero",

                /** `1 insumo` · `6 insumos` */
                count: {
                    zero: "Sin insumos",
                    one: "{count} insumo",
                    other: "{count} insumos",
                } satisfies Plural,

                /** Tope de líneas: una receta más larga que esto suele ser dos recetas. */
                limitReached: "La receta admite hasta {max} insumos. Quita alguno para añadir otro.",

                empty: {
                    title: "La receta todavía no tiene insumos",
                    message:
                        "Busca un insumo del inventario y añádelo para calcular lo que cuesta preparar el producto.",
                },
            },

            /**
             * Aviso de insumos agotados.
             *
             * Dice la consecuencia antes que la causa —lo que le importa a quien
             * está dando de alta el producto es que no se va a poder vender— y
             * termina en lo que hay que hacer para arreglarlo. Enumera los
             * insumos porque con seis líneas en pantalla "hay uno agotado" deja
             * a quien lo lee buscando cuál.
             */
            outOfStockNotice: {
                title: "El producto se publicará como no disponible",
                description: {
                    /* Sin comillas: `{names}` llega ya entrecomillado, porque el
                       plural las necesita alrededor de cada nombre y no del
                       conjunto. */
                    one: "{names} está agotado en el inventario. Repón sus existencias para que el producto vuelva a la carta.",
                    other: "{names} están agotados en el inventario. Repón sus existencias para que el producto vuelva a la carta.",
                } satisfies Plural,
            },

            /* Costo de la receta. */
            total: {
                label: "Costo total de la receta",
                hint: "Costo por unidad de cada insumo multiplicado por la cantidad indicada.",
                /** Mientras alguna línea no tenga una cantidad válida. */
                pending: "Indica la cantidad de cada insumo para calcular el costo.",
            },

            /* ── Validación ─────────────────────────────────────────────── */

            validation: {
                quantityRequired: "Indica cuánto se usa de este insumo.",
                quantityMin: "La cantidad tiene que ser mayor que 0.",
                quantityMax: "La cantidad no puede pasar de {max} {unit}.",

                recipeRequired: "Añade al menos un insumo del inventario para continuar.",
                recipeMax: "La receta admite hasta {max} insumos. Quita los que sobren para continuar.",
                ingredientDuplicated: "Hay insumos repetidos en la receta. Deja una sola línea por insumo.",
            },
        },

        /* ── Paso 3: precio y disponibilidad ────────────────────────────── */

        pricing: {
            /** Nombre del grupo de campos. No se ve: en pantalla lo da el indicador. */
            legend: "Precio y disponibilidad del producto",

            /** Lo que costó preparar una unidad, traído del paso de la receta. */
            cost: {
                label: "Costo de la receta",
                hint: "Lo que cuesta preparar una unidad con los insumos del paso anterior.",
            },

            margin: {
                label: "Margen de ganancia",
                placeholder: "Ej. 45",
                helper: "Lo que se gana sobre el costo. Al escribirlo se calcula el precio de venta.",
                /** Sin receta no hay costo sobre el que calcular nada. */
                missingCost: "Vuelve al paso anterior y completa la receta para poder calcularlo.",
            },

            price: {
                label: "Precio de venta",
                placeholder: "Ej. 12.000",
                helper: "Lo que paga el cliente. Al escribirlo se recalcula el margen.",
            },

            profit: {
                label: "Ganancia por unidad",
                hint: "Lo que queda de cada unidad vendida después de pagar los insumos.",
                /** Reemplaza al `hint` cuando ya hay margen: dice a cuánto equivale. */
                margin: "Equivale a un margen de {margin} sobre el costo.",
                pending: "Indica el margen o el precio para calcular la ganancia.",
            },

            /**
             * El desglose que cierra el paso.
             *
             * Las dos cifras de arriba son sumandos y el precio de venta es su
             * total: verlos en la misma columna es lo que explica de dónde sale
             * lo que paga el cliente.
             */
            summary: {
                title: "Cómo se compone el precio",
            },

            total: {
                label: "Precio de venta",
                hint: "Sale de sumar el costo y la ganancia.",
                pending: "Escribe el margen o el precio para verlo.",
            },

            /**
             * Vender por debajo del costo avisa pero no bloquea: un plato
             * gancho o una promoción son decisiones legítimas.
             */
            belowCostNotice: {
                title: "El precio está por debajo del costo",
                description:
                    "Cada unidad vendida pierde {amount}. Si es a propósito puedes continuar.",
            },

            availability: {
                label: "Disponible en la carta",
                on: "Se publica en la carta al guardar el producto.",
                off: "Se guarda, pero no se vende hasta que lo actives.",
            },

            /* ── Configuración por sucursal ─────────────────────────────── */

            branches: {
                title: "Precios por sucursal",
                hint: "Cada sucursal usa el precio y la disponibilidad de arriba. Personaliza solo las que se salgan de ahí.",

                count: {
                    zero: "Todas heredan la configuración global",
                    one: "{count} sucursal personalizada",
                    other: "{count} sucursales personalizadas",
                } satisfies Plural,

                badge: {
                    inherited: "Hereda",
                    custom: "Personalizada",
                },

                /**
                 * Acciones del encabezado de la tarjeta.
                 *
                 * Son un botón y no un interruptor: dentro de la tarjeta ya hay
                 * uno —la disponibilidad—, y dos carriles idénticos juntos no
                 * dejan ver cuál cambia la forma de la tarjeta y cuál es un dato
                 * del producto. El nombre accesible repite la sucursal porque
                 * el botón se oye fuera de su tarjeta.
                 */
                actions: {
                    customize: "Personalizar",
                    customizeLabel: "Personalizar {name}",
                    reset: "Usar la configuración global",
                    resetLabel: "Usar la configuración global en {name}",
                },

                price: {
                    label: "Precio",
                    fieldLabel: "Precio en {name}",
                    pending: "Todavía no hay precio global",
                },

                availability: {
                    label: "Disponibilidad",
                    /** Empieza por la etiqueta que se ve, como pide WCAG 2.5.3. */
                    fieldLabel: "Disponibilidad en {name}",
                    on: "Disponible",
                    off: "No disponible",
                },

                /** `Margen 45,0 %` — debajo del precio de la sucursal. */
                margin: "Margen {margin}",
            },

            /* ── Validación ─────────────────────────────────────────────── */

            validation: {
                priceRequired: "Indica a qué precio se vende el producto.",
                priceMin: "El precio tiene que ser mayor que 0.",
                priceMax: "El precio no puede pasar de {max}.",

                marginMin: "El margen no puede bajar de {min} %.",
                marginMax: "El margen no puede pasar de {max} %.",

                branchPriceRequired: "Indica el precio de {name} o deja que herede el global.",
                branchPriceMin: "El precio de {name} tiene que ser mayor que 0.",
                branchPriceMax: "El precio de {name} no puede pasar de {max}.",
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
         * Cómo se llama lo que se pagina, en el pie de la tabla.
         *
         * Es sólo el nombre, sin la cantidad: el pie ya escribe el número por
         * su cuenta —"Mostrando 1–12 de 40 categorías"— y un `{count}` aquí
         * saldría repetido.
         */
        itemLabel: {
            one: "categoría",
            other: "categorías",
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
        loadError: "No pudimos cargar las categorías. Revisa tu conexión y vuelve a intentarlo.",
        emptyCatalog:
            "Todavía no hay categorías. Crea la primera para empezar a agrupar la carta.",

        /**
         * Cuando el filtro no encuentra nada.
         *
         * Son tres frases y no una porque el motivo del vacío es distinto en
         * cada caso, y la salida también: con un término escrito lo probable es
         * una errata, con un estado elegido lo probable es que ese estado esté
         * vacío, y con los dos hay que decir cuál aflojar primero.
         *
         * Ninguna dice "sin resultados" a secas. Repiten el término tal y como
         * se escribió —para que la errata se vea— y terminan en lo que se puede
         * hacer, que es la diferencia entre un aviso y un callejón sin salida.
         */
        emptyFiltered: {
            withQuery:
                "Ninguna categoría coincide con «{query}». Revisa la escritura o prueba con una palabra más corta.",
            withStatus:
                "No hay categorías {status} en este momento. Cambia el filtro de estado para ver el resto de la carta.",
            withBoth:
                "Ninguna categoría {status} coincide con «{query}». Prueba con otro término o quita el filtro de estado.",
        },

        saveError: "No se pudo guardar la categoría.",

        /* ── Estado ─────────────────────────────────────────────────────── */
        // Las claves nombran el estado y no el valor del campo: un
        // `status.true` obligaría a leer el tipo para saber qué significa.

        status: {
            active: "Activa",
            inactive: "Inactiva",
        },

        /**
         * El mismo estado, en plural y en minúscula.
         *
         * Existe porque estos rótulos van **dentro** de una frase —"No hay
         * categorías inactivas"— y los de arriba van solos, dentro de una
         * insignia. Componer uno a partir del otro pidiendo un `toLowerCase()`
         * y una `s` funciona en español y se rompe en el primer idioma que no
         * forme el plural añadiendo una letra.
         */
        statusPlural: {
            active: "activas",
            inactive: "inactivas",
        },

        /* ── Barra de filtros ───────────────────────────────────────────── */

        toolbar: {
            searchPlaceholder: "Buscar por nombre o descripción",
            searchLabel: "Buscar categorías",

            filterLabel: "Filtrar categorías por estado",
            /** Opción del filtro que no filtra. Es un valor, no la ausencia de uno. */
            allStatuses: "Todos los estados",

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

            /**
             * Las ayudas llevan los límites dentro, en huecos `{min}` y `{max}`.
             *
             * Los números no se escriben aquí a mano: los rellena
             * `CATEGORY_FIELD_HINTS` con las mismas constantes que validan el
             * campo. Escribirlos en el texto los dejaría diciendo "mínimo 2"
             * el día que la regla pase a exigir tres.
             */
            name: {
                label: "Nombre",
                placeholder: "Ej. Bebidas calientes",
                helper: "Entre {min} y {max} caracteres. Así aparecerá como sección de la carta.",
            },
            description: {
                label: "Descripción",
                placeholder: "Ej. Cafés, tés e infusiones preparados al momento.",
                helper: "Opcional. Si la escribes, entre {min} y {max} caracteres.",
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
            /** Vacía sí vale —el campo es opcional—; a medias, no. */
            descriptionMin: "Si escribes una descripción, dale al menos {min} caracteres.",

            /**
             * Caracteres no admitidos.
             *
             * El mensaje enumera lo que **sí** se puede escribir en vez de
             * nombrar el que sobra: quien pegó un nombre desde una hoja de
             * cálculo no sabe cuál de los cuarenta caracteres molesta, y con la
             * lista de permitidos lo ve de un vistazo.
             */
            nameChars: "El nombre solo admite letras, números, espacios y los signos , . & - '",
            descriptionChars: "La descripción solo admite letras, números, espacios y signos de puntuación.",
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
