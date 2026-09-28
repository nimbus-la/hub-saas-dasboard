/**
 * Textos del módulo de empleados
 *
 * Todo lo que se lee en la pantalla de empleados: títulos, rótulos de campo,
 * mensajes de validación, estados vacíos y las etiquetas accesibles de sus
 * controles.
 *
 * Los mensajes de validación viven con su pantalla y no en un bloque aparte
 * porque el número que los provoca y el texto que lo explica tienen que viajar
 * juntos: un `max: 40` en las reglas y un "no puede pasar de 40" en otro
 * archivo se desincronizan al primer cambio. Por eso el límite entra como
 * hueco `{max}` en lugar de escrito a mano — las reglas lo inyectan desde la
 * constante que además usa la ayuda del campo.
 */

import type { Plural } from "../../types";


export const employees = {

    /* ====================================================================== */
    /*  Metadatos de las rutas                                                */
    /* ====================================================================== */

    metadata: {
        list: {
            title: "Empleados · Vorea",
            description: "Equipo de trabajo y acceso de tus sucursales.",
        },
    },


    /* ====================================================================== */
    /*  Listado                                                               */
    /* ====================================================================== */

    title: "Empleados",
    subtitle:
        "Gestiona el equipo que atiende tus sucursales, su acceso y su estado laboral.",
    backLabel: "Volver al inicio",

    /** `1 empleado` · `22 empleados` */
    count: {
        one: "{count} empleado",
        other: "{count} empleados",
    } satisfies Plural,

    /**
     * Cómo se llama lo que se pagina, en el pie de la tabla.
     *
     * Es sólo el nombre, sin la cantidad: el pie ya escribe el número por su
     * cuenta —"Mostrando 1–12 de 40 empleados"— y un `{count}` aquí saldría
     * repetido.
     */
    itemLabel: {
        one: "empleado",
        other: "empleados",
    } satisfies Plural,

    /**
     * Qué dice la tabla cuando no pinta filas.
     *
     * Son cuatro situaciones y la diferencia importa: cargando, la API falló,
     * no hay equipo, o el filtro no encontró nada. Un único "sin resultados"
     * para las cuatro es el camino corto a que alguien dé por perdidos a sus
     * empleados durante un corte de red.
     */
    loading: "Cargando empleados…",
    loadError: "No pudimos cargar los empleados. Revisa tu conexión y vuelve a intentarlo.",
    emptyCatalog:
        "Todavía no hay empleados. Crea el primero para empezar a armar el equipo.",

    /**
     * Cuando el filtro no encuentra nada.
     *
     * Son tres frases y no una porque el motivo del vacío es distinto en cada
     * caso, y la salida también: con un término escrito lo probable es una
     * errata, con un estado elegido lo probable es que ese estado esté vacío,
     * y con los dos hay que decir cuál aflojar primero.
     */
    emptyFiltered: {
        withQuery:
            "Ningún empleado coincide con «{query}». Revisa la escritura o prueba con una palabra más corta.",
        withStatus:
            "No hay empleados {status} en este momento. Cambia el filtro de estado para ver el resto del equipo.",
        withBoth:
            "Ningún empleado {status} coincide con «{query}». Prueba con otro término o quita el filtro de estado.",
    },

    saveError: "No se pudo guardar el empleado.",

    /* ── Estado ─────────────────────────────────────────────────────────── */

    status: {
        active: "Activo",
        inactive: "Inactivo",
    },

    /**
     * El mismo estado, en plural y en minúscula.
     *
     * Existe porque estos rótulos van **dentro** de una frase —"No hay empleados
     * inactivos"— y los de arriba van solos, dentro de una insignia.
     */
    statusPlural: {
        active: "activos",
        inactive: "inactivos",
    },

    /* ── Sexo ───────────────────────────────────────────────────────────── */
    // Las claves son los valores que publica el backend, no traducciones.

    sexLabels: {
        FEMALE: "Femenino",
        MALE: "Masculino",
    },

    /* ── Roles ──────────────────────────────────────────────────────────── */
    // El texto de aquí es, hoy, el mismo `rolName` que el backend publica;
    // viven separados porque los rótulos son UX y los valores son datos, y
    // algún día pueden divergir sin que el contrato con el servidor cambie.

    roles: {
        Cajero: "Cajero",
        Administrador: "Administrador",
        Mesero: "Mesero",
        Cocina: "Cocina",
    },

    /* ── Barra de filtros ───────────────────────────────────────────────── */

    toolbar: {
        searchPlaceholder: "Buscar por nombre, usuario o correo",
        searchLabel: "Buscar empleados",

        filterLabel: "Filtrar empleados por estado",
        /** Opción del filtro que no filtra. Es un valor, no la ausencia de uno. */
        allStatuses: "Todos los estados",

        create: "Crear empleado",

        /** `3 empleados de 8` — cuántos quedan tras filtrar. */
        summary: "{visible} de {total}",
    },

    /* ── Tabla ──────────────────────────────────────────────────────────── */

    table: {
        userName: "Usuario",
        fullName: "Nombre",
        email: "Correo",
        role: "Rol",
        status: "Estado",
        updatedAt: "Fecha de actualización",

        noEmail: "Sin correo",

        /**
         * Acciones de fila.
         *
         * La etiqueta accesible nombra al empleado y no sólo la acción: con
         * ocho filas iguales, ocho botones que dicen "Editar" no se distinguen
         * entre sí al navegar por la lista de controles.
         */
        edit: "Editar",
        editEmployee: "Editar a {name}",
        delete: "Eliminar",
        deleteEmployee: "Eliminar a {name}",
    },

    /* ── Alta y edición ─────────────────────────────────────────────────── */

    form: {
        /**
         * Los dos modos del modal.
         *
         * Comparten campos y reglas, y se diferencian sólo en lo que dicen y en
         * si enseñan el interruptor. Tenerlos en una tabla evita el
         * `isEdit ? … : …` repetido cinco veces dentro del JSX.
         */
        create: {
            title: "Nuevo empleado",
            description:
                "Da de alta a alguien del equipo. El acceso queda activo desde el primer momento.",
            submit: "Crear empleado",
        },
        edit: {
            title: "Editar empleado",
            description:
                "Cambia sus datos personales, su acceso o retíralo de la operación sin borrar su historial.",
            submit: "Guardar cambios",
        },

        close: "Cerrar el formulario de empleado",

        userName: {
            label: "Usuario",
            placeholder: "Ej. luna.bedoya",
            helper: "Entre {min} y {max} caracteres. Será su nombre para entrar al panel.",
        },
        email: {
            label: "Correo",
            placeholder: "Ej. luna@vorea.co",
            helper: "Opcional. Hasta {max} caracteres.",
        },
        firstName: {
            label: "Primer nombre",
            placeholder: "Ej. Luna",
            helper: "Entre {min} y {max} caracteres.",
        },
        secondName: {
            label: "Segundo nombre",
            placeholder: "Ej. Valentina",
            helper: "Opcional. Entre {min} y {max} caracteres.",
        },
        firstLastName: {
            label: "Primer apellido",
            placeholder: "Ej. Bedoya",
            helper: "Entre {min} y {max} caracteres.",
        },
        secondLastName: {
            label: "Segundo apellido",
            placeholder: "Ej. Restrepo",
            helper: "Opcional. Entre {min} y {max} caracteres.",
        },
        birthDate: {
            label: "Fecha de nacimiento",
            placeholder: "AAAA-MM-DD",
            helper: "No puede ser una fecha futura.",
        },
        sex: {
            label: "Sexo",
            placeholder: "Selecciona una opción",
            helper: "Según la identificación del empleado.",
        },
        role: {
            label: "Rol",
            placeholder: "Selecciona su rol",
            helper: "Define qué hace en el negocio y con qué alcance entra al panel.",
        },
        phone: {
            label: "Teléfono",
            placeholder: "Ej. 315 185 7908",
            helper: "Opcional. Entre {min} y {max} caracteres.",
        },

        activeLabel: "Empleado activo",
        /** Qué significa mover el interruptor. */
        activeHint: {
            on: "Puede entrar al panel y aparece en la operación.",
            off: "No puede entrar al panel. Su historial se conserva.",
        },
    },

    /* ── Validación ─────────────────────────────────────────────────────── */

    validation: {
        userNameRequired: "Escribe el usuario con el que entrará al panel.",
        userNameMax: "El usuario no puede pasar de {max} caracteres.",
        userNameMin: "El usuario necesita al menos {min} caracteres.",
        userNameChars: "El usuario solo admite letras, números y los signos . _ -",

        emailMax: "El correo supera los {max} caracteres.",
        emailFormat: "Escribe un correo válido, por ejemplo nombre@dominio.co",

        firstNameRequired: "Escribe el primer nombre.",
        firstLastNameRequired: "Escribe el primer apellido.",
        nameMax: "El nombre no puede pasar de {max} caracteres.",
        nameMin: "El nombre necesita al menos {min} caracteres.",
        nameChars: "El nombre solo admite letras, espacios y los signos - '",

        /** Vacío sí vale —el campo es opcional—; a medias, no. */
        nameOptionalMin: "Si lo escribes, dale al menos {min} caracteres.",

        birthDateRequired: "Elige la fecha de nacimiento.",
        birthDateFormat: "Escribe la fecha en formato AAAA-MM-DD.",
        birthDateFuture: "La fecha de nacimiento no puede ser futura.",

        sexRequired: "Selecciona el sexo del empleado.",

        roleRequired: "Selecciona el rol del empleado.",

        phoneMax: "El teléfono supera los {max} caracteres.",
        phoneMin: "El teléfono necesita al menos {min} caracteres.",
        phoneChars: "El teléfono solo admite números, espacios y los signos + ( ) -",
    },

    /* ── Borrado ────────────────────────────────────────────────────────── */

    delete: {
        title: "Eliminar empleado",
        confirm: "Eliminar",
        cancel: "Cancelar",

        /**
         * Qué se pierde al borrar.
         *
         * Nombra al empleado en lugar de decir "este empleado": el diálogo se
         * abre desde una fila cualquiera de una tabla de ocho iguales.
         *
         * Y ofrece la salida buena. Desactivar es lo que se quiere hacer nueve
         * de cada diez veces, así que el diálogo lo dice justo donde alguien
         * está a punto de borrar por no saber que existía.
         */
        description:
            "Se eliminará «{name}» y perderá el acceso al panel. Si solo quieres que deje de trabajar, desactívalo en su lugar.",
    },
} as const;