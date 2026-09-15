import type { BadgeTone } from "@/interfaces";
import { messages } from "@/messages";

import { EmployeeFormValues, EmployeeRole, EmployeeSex } from "../interfaces";

const copy = messages.employees;


/**
 * Marca de posición de un dato vacío.
 *
 * Una raya y no una celda en blanco: el hueco vacío se lee como un fallo de
 * carga, la raya dice "aquí no hay nada y es correcto".
 */
export const EMPTY_VALUE = "-";


/* -------------------------------------------------------------------------- */
/*  Sexo                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Valores que publica el backend.
 *
 * Se conservan tal cual porque son la clave de la tabla de rótulos: cambiar el
 * valor sin cambiar el rótulo —o al revés— es exactamente el desajuste que
 * `satisfies` se encarga de impedir.
 */
export const EMPLOYEE_SEX_VALUES = ["FEMALE", "MALE"] as const satisfies readonly EmployeeSex[];

/** Rótulos legibles de cada valor, en el orden en que se leen. */
export const EMPLOYEE_SEX_LABELS: Record<EmployeeSex, string> = copy.sexLabels;

/**
 * Opciones del selector.
 *
 * Se declara como constante de módulo —y no como literal en el JSX— porque el
 * selector memoiza su lista por identidad: un array nuevo en cada render la
 * recalcularía entera en cada tecla del buscador de al lado.
 */
export const EMPLOYEE_SEX_OPTIONS: {
    value: EmployeeSex;
    label: string;
}[] = EMPLOYEE_SEX_VALUES.map((value) => ({
    value,
    label: EMPLOYEE_SEX_LABELS[value],
}));


/* -------------------------------------------------------------------------- */
/*  Rol                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Roles que publica el backend, en el orden en que se leen.
 *
 * Catálogo provisional a la espera del endpoint que traiga los roles reales
 * del negocio: cuando exista, este array se reemplaza por la respuesta de la
 * API y nada más de la pantalla cambia, porque todo el mundo consume estas
 * constantes. Los valores son los `rolName` tal cual los responde el servidor
 * —«Cajero», no `CAJERO»— y el `rolScope` lo deriva el propio backend.
 */
export const EMPLOYEE_ROLE_VALUES = [
    "Cajero",
    "Administrador",
    "Mesero",
    "Cocina",
] as const satisfies readonly EmployeeRole[];

/** Rótulos legibles de cada rol, en el mismo orden que se leen. */
export const EMPLOYEE_ROLE_LABELS: Record<EmployeeRole, string> = copy.roles;

/**
 * Opciones del selector.
 *
 * Constante de módulo por el mismo motivo que las del sexo: el selector
 * memoiza su lista por identidad.
 */
export const EMPLOYEE_ROLE_OPTIONS: {
    value: EmployeeRole;
    label: string;
}[] = EMPLOYEE_ROLE_VALUES.map((value) => ({
    value,
    label: EMPLOYEE_ROLE_LABELS[value],
}));


/* -------------------------------------------------------------------------- */
/*  Filtro por estado                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Valores del filtro de estado.
 *
 * `all` es un valor de verdad y no la ausencia de filtro: el selector siempre
 * tiene algo elegido, y "Todos" es una opción tan explícita como las otras dos.
 */
export const EMPLOYEE_STATUS_FILTERS = ["all", "active", "inactive"] as const;

export type EmployeeStatusFilter = (typeof EMPLOYEE_STATUS_FILTERS)[number];

/*
 * Se declara con `satisfies` y no con una anotación de tipo para que conserve
 * su tipo literal (`"all"`, no `EmployeeStatusFilter`): comparar contra esta
 * constante **descarta** `"all"` del resto de ramas, que es lo que permite
 * indexar los rótulos de estado sin un `as` de por medio.
 */
export const DEFAULT_EMPLOYEE_STATUS_FILTER = "all" satisfies EmployeeStatusFilter;


/**
 * Qué valor de `isActive` exige cada opción del filtro.
 *
 * El estado laboral es un booleano, pero el filtro tiene **tres** posiciones:
 * sí, no, y "me da igual". Traducirlo a una tabla de correspondencias lo
 * vuelve declarativo: `null` significa "no filtra".
 */
export const EMPLOYEE_STATUS_TO_IS_ACTIVE: Record<
    EmployeeStatusFilter,
    boolean | null
> = {
    all: null,
    active: true,
    inactive: false,
};


/* -------------------------------------------------------------------------- */
/*  Presentación del estado                                                    */
/* -------------------------------------------------------------------------- */
// El rótulo y el tono se resuelven aquí y no en la tabla para que cualquier
// vista que muestre un empleado lo pinte igual.

export const EMPLOYEE_STATUS_LABELS = copy.status;

/** Los mismos estados en plural y minúscula, para meterlos dentro de una frase. */
export const EMPLOYEE_STATUS_PLURAL_LABELS = copy.statusPlural;

export const EMPLOYEE_STATUS_TONES: Record<
    keyof typeof EMPLOYEE_STATUS_LABELS,
    BadgeTone
> = {
    active: "success",
    inactive: "neutral",
};


/**
 * Opciones del selector, en el orden en que se leen.
 */
export const EMPLOYEE_STATUS_OPTIONS: {
    value: EmployeeStatusFilter;
    label: string;
}[] = [
        { value: "all", label: copy.toolbar.allStatuses },
        { value: "active", label: EMPLOYEE_STATUS_LABELS.active },
        { value: "inactive", label: EMPLOYEE_STATUS_LABELS.inactive },
    ];


/* -------------------------------------------------------------------------- */
/*  Formulario                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * El alta parte de esta plantilla.
 *
 * `sex` y `role` arrancan en cadena vacía —nadie ha elegido nada— y el
 * interruptor, en `true`: todo empleado nuevo nace activo.
 */
export const EMPTY_EMPLOYEE_FORM_VALUES: EmployeeFormValues = {
    userName: "",
    email: "",
    firstName: "",
    secondName: "",
    firstLastName: "",
    secondLastName: "",
    birthDate: "",
    role: "",
    sex: "",
    phone: "",
    isActive: true,
};