// ── Dominio: alta y edición de un empleado ──────────────────────────────────
// Los campos del formulario, sus límites y las reglas que dicen si un valor
// sirve. Vive fuera de la pantalla por el mismo motivo que `category-form.ts`:
// cuando el backend valide lo mismo, las dos partes tienen que estar mirando
// los mismos números.
//
// Aquí no hay una sola clase de Tailwind ni un solo componente: es texto y
// reglas. El modal decide cómo se pintan.

import type { RegisterOptions } from "react-hook-form";

import { formatMessage, messages } from "@/messages";

import { EmployeeFormValues, EmployeeList } from "../interfaces";

/** Atajo al bloque del catálogo que da nombre a todo lo de este archivo. */
const copy = messages.employees;

/* -------------------------------------------------------------------------- */
/*  Reglas de validación                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Límites de los campos.
 *
 * El usuario es el rótulo con el que alguien entra al panel: corto para
 * teclearse y legible en una tabla. Un nombre o apellido de 40 caracteres deja
 * de ser un nombre y pasa a ser un párrafo; el segundo nombre y el segundo
 * apellido son opcionales y comparten esos mismos topes. El correo y el
 * teléfono no tienen mínimo: o vienen completos o no vienen.
 */
export const EMPLOYEE_USERNAME_LIMITS = { min: 3, max: 30 } as const;
export const EMPLOYEE_EMAIL_LIMITS = { max: 80 } as const;
export const EMPLOYEE_NAME_LIMITS = { min: 2, max: 40 } as const;
export const EMPLOYEE_PHONE_LIMITS = { min: 7, max: 15 } as const;


/**
 * Caracteres admitidos.
 *
 * El usuario es un identificador: letras, números y los tres signos que un
 * nombre de usuario suele llevar (`.` `_` `-`). Los nombres propios son
 * lenguaje —letras con sus tildes y su ñ, espacios, y el apóstrofo o guion de
 * "D'Angelo" o "María-Elena"—. El teléfono, sólo lo que se marca: cifras,
 * espacios y los signos `+ ( ) -`.
 */
const USERNAME_ALLOWED_CHARS = /^[\p{L}\p{N}._-]+$/u;
const NAME_ALLOWED_CHARS = /^[\p{L} '’-]+$/u;
const PHONE_ALLOWED_CHARS = /^[\p{N} +()\-]+$/u;

/** La comprobación mínima de correo: algo@algo.algo */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

/**
 * Fecha de hoy en el formato del campo (`YYYY-MM-DD`), en hora local.
 *
 * Se calcula por función y no como constante de módulo: las reglas se evalúan
 * durante toda la vida de la pestaña, y una fecha nacida a medianoche no debe
 * quedar grabada hasta que la pestaña se cierre.
 */
const todayISO = (): string => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${now.getFullYear()}-${month}-${day}`;
};


type FieldRules<K extends keyof EmployeeFormValues> = RegisterOptions<
    EmployeeFormValues,
    K
>;

/**
 * Reglas de cada campo, en el formato que espera react-hook-form.
 *
 * Los mensajes dicen qué falta y qué hacer. "Campo obligatorio" no es un
 * mensaje de error, es una etiqueta.
 *
 * La unicidad del usuario no está aquí: depende del resto de empleados, que el
 * formulario no conoce. La comprueba la pantalla, que sí los tiene, y la
 * inyecta como una regla más al montar el modal.
 */
export const EMPLOYEE_FORM_RULES = {
    userName: {
        required: copy.validation.userNameRequired,
        maxLength: {
            value: EMPLOYEE_USERNAME_LIMITS.max,
            message: formatMessage(copy.validation.userNameMax, {
                max: EMPLOYEE_USERNAME_LIMITS.max,
            }),
        },

        // Las comprobaciones van en un objeto y no en funciones sueltas para
        // que el modal pueda añadir la unicidad sin reescribirlas: son reglas
        // con nombre, y react-hook-form las mezcla por clave.
        validate: {
            length: (value: string) =>
                value.trim().length >= EMPLOYEE_USERNAME_LIMITS.min ||
                formatMessage(copy.validation.userNameMin, {
                    min: EMPLOYEE_USERNAME_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                USERNAME_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.userNameChars,
        },
    } satisfies FieldRules<"userName">,

    email: {
        maxLength: {
            value: EMPLOYEE_EMAIL_LIMITS.max,
            message: formatMessage(copy.validation.emailMax, {
                max: EMPLOYEE_EMAIL_LIMITS.max,
            }),
        },

        validate: {
            // Vacío sí vale —el campo es opcional—; a medias, no.
            format: (value: string) =>
                value.trim().length === 0 ||
                EMAIL_PATTERN.test(value.trim()) ||
                copy.validation.emailFormat,
        },
    } satisfies FieldRules<"email">,

    firstName: {
        required: copy.validation.firstNameRequired,
        maxLength: {
            value: EMPLOYEE_NAME_LIMITS.max,
            message: formatMessage(copy.validation.nameMax, {
                max: EMPLOYEE_NAME_LIMITS.max,
            }),
        },

        validate: {
            length: (value: string) =>
                value.trim().length >= EMPLOYEE_NAME_LIMITS.min ||
                formatMessage(copy.validation.nameMin, {
                    min: EMPLOYEE_NAME_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                NAME_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.nameChars,
        },
    } satisfies FieldRules<"firstName">,

    secondName: {
        maxLength: {
            value: EMPLOYEE_NAME_LIMITS.max,
            message: formatMessage(copy.validation.nameMax, {
                max: EMPLOYEE_NAME_LIMITS.max,
            }),
        },

        validate: {
            length: (value: string) =>
                value.trim().length === 0 ||
                value.trim().length >= EMPLOYEE_NAME_LIMITS.min ||
                formatMessage(copy.validation.nameOptionalMin, {
                    min: EMPLOYEE_NAME_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                NAME_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.nameChars,
        },
    } satisfies FieldRules<"secondName">,

    firstLastName: {
        required: copy.validation.firstLastNameRequired,
        maxLength: {
            value: EMPLOYEE_NAME_LIMITS.max,
            message: formatMessage(copy.validation.nameMax, {
                max: EMPLOYEE_NAME_LIMITS.max,
            }),
        },

        validate: {
            length: (value: string) =>
                value.trim().length >= EMPLOYEE_NAME_LIMITS.min ||
                formatMessage(copy.validation.nameMin, {
                    min: EMPLOYEE_NAME_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                NAME_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.nameChars,
        },
    } satisfies FieldRules<"firstLastName">,

    secondLastName: {
        maxLength: {
            value: EMPLOYEE_NAME_LIMITS.max,
            message: formatMessage(copy.validation.nameMax, {
                max: EMPLOYEE_NAME_LIMITS.max,
            }),
        },

        validate: {
            length: (value: string) =>
                value.trim().length === 0 ||
                value.trim().length >= EMPLOYEE_NAME_LIMITS.min ||
                formatMessage(copy.validation.nameOptionalMin, {
                    min: EMPLOYEE_NAME_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                NAME_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.nameChars,
        },
    } satisfies FieldRules<"secondLastName">,

    birthDate: {
        required: copy.validation.birthDateRequired,
        maxLength: { value: 10, message: copy.validation.birthDateFormat },

        validate: {
            format: (value: string) =>
                value.trim().length === 0 ||
                /^\d{4}-\d{2}-\d{2}$/.test(value.trim()) ||
                copy.validation.birthDateFormat,

            notFuture: (value: string) =>
                value.trim().length === 0 ||
                value.trim() <= todayISO() ||
                copy.validation.birthDateFuture,
        },
    } satisfies FieldRules<"birthDate">,

    sex: {
        required: copy.validation.sexRequired,
    } satisfies FieldRules<"sex">,

    role: {
        required: copy.validation.roleRequired,
    } satisfies FieldRules<"role">,

    phone: {
        maxLength: {
            value: EMPLOYEE_PHONE_LIMITS.max,
            message: formatMessage(copy.validation.phoneMax, {
                max: EMPLOYEE_PHONE_LIMITS.max,
            }),
        },

        validate: {
            length: (value: string) =>
                value.trim().length === 0 ||
                value.trim().length >= EMPLOYEE_PHONE_LIMITS.min ||
                formatMessage(copy.validation.phoneMin, {
                    min: EMPLOYEE_PHONE_LIMITS.min,
                }),

            charset: (value: string) =>
                value.trim().length === 0 ||
                PHONE_ALLOWED_CHARS.test(value.trim()) ||
                copy.validation.phoneChars,
        },
    } satisfies FieldRules<"phone">,
} as const;


/* -------------------------------------------------------------------------- */
/*  Cambios respecto a lo guardado                                             */
/* -------------------------------------------------------------------------- */

/**
 * ¿Lo que hay en el formulario difiere del empleado guardado?
 *
 * Es lo que decide si "Guardar cambios" está disponible al editar: sin ningún
 * cambio, el botón manda una petición que deja todo exactamente igual.
 *
 * Se compara **recortado**, y no con el `isDirty` de react-hook-form, porque
 * ese marca sucio el formulario en cuanto se escribe un espacio al final del
 * nombre — un cambio que el mapper elimina antes de enviarlo y que por tanto no
 * cambia nada. Basta con que difiera un campo: no hay que tocarlos todos.
 */
export function hasEmployeeChanges(
    values: EmployeeFormValues,
    employee: EmployeeList
): boolean {
    return (
        values.userName.trim() !== employee.userName.trim() ||
        values.email.trim() !== employee.email.trim() ||
        values.firstName.trim() !== employee.firstName.trim() ||
        values.secondName.trim() !== employee.secondName.trim() ||
        values.firstLastName.trim() !== employee.firstLastName.trim() ||
        values.secondLastName.trim() !== employee.secondLastName.trim() ||
        values.birthDate !== employee.birthDate ||
        values.sex !== employee.sex ||
        values.role !== employee.rolName ||
        values.phone.trim() !== employee.phone.trim() ||
        values.isActive !== employee.isActive
    );
}

/* -------------------------------------------------------------------------- */
/*  Textos                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Los dos modos del modal.
 *
 * Comparten campos y reglas, y se diferencian solo en lo que dicen y en si
 * enseñan el interruptor. Tenerlos en una tabla evita el `isEdit ? … : …`
 * repetido cinco veces dentro del JSX.
 */
export const EMPLOYEE_MODAL_COPY = {
    create: copy.form.create,
    edit: copy.form.edit,
} as const;

export type EmployeeModalMode = keyof typeof EMPLOYEE_MODAL_COPY;


/**
 * Ayudas de cada campo, con sus límites ya dentro.
 *
 * El mínimo se anuncia **antes** de escribir y no solo al fallar: un campo que
 * recibe "A" y lo rechaza sin haber avisado de que pedía dos caracteres se lee
 * como un error de la aplicación. Los números salen de las constantes de
 * arriba, así que el texto y la regla no pueden discrepar.
 */
export const EMPLOYEE_FIELD_HINTS = {
    userName: formatMessage(copy.form.userName.helper, {
        min: EMPLOYEE_USERNAME_LIMITS.min,
        max: EMPLOYEE_USERNAME_LIMITS.max,
    }),
    email: formatMessage(copy.form.email.helper, {
        max: EMPLOYEE_EMAIL_LIMITS.max,
    }),
    firstName: formatMessage(copy.form.firstName.helper, {
        min: EMPLOYEE_NAME_LIMITS.min,
        max: EMPLOYEE_NAME_LIMITS.max,
    }),
    secondName: formatMessage(copy.form.secondName.helper, {
        min: EMPLOYEE_NAME_LIMITS.min,
        max: EMPLOYEE_NAME_LIMITS.max,
    }),
    firstLastName: formatMessage(copy.form.firstLastName.helper, {
        min: EMPLOYEE_NAME_LIMITS.min,
        max: EMPLOYEE_NAME_LIMITS.max,
    }),
    secondLastName: formatMessage(copy.form.secondLastName.helper, {
        min: EMPLOYEE_NAME_LIMITS.min,
        max: EMPLOYEE_NAME_LIMITS.max,
    }),
    phone: formatMessage(copy.form.phone.helper, {
        min: EMPLOYEE_PHONE_LIMITS.min,
        max: EMPLOYEE_PHONE_LIMITS.max,
    }),
} as const;

/** Aviso del interruptor. Explica qué pasa con el acceso al desactivar. */
export const EMPLOYEE_ACTIVE_HINT = copy.form.activeHint;