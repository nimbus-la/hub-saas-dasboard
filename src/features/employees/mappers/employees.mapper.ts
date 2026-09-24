import { formatDate } from "@/lib/format";
import type {
    CreateEmployeeParams,
    EmployeeFormValues,
    EmployeeList,
    EmployeeListApiResponse,
    EmployeeRole,
    EmployeeSex,
    UpdateEmployeeParams,
} from "../interfaces";


/**
 * Traductores entre el backend y el dominio
 *
 * Frontera de una sola dirección: lo que entra tiene la forma que decidió el
 * backend, lo que sale tiene la forma con la que quiere trabajar la aplicación.
 * Todo lo que hay más adentro —caché, pantallas, tabla, formulario— ve
 * `EmployeeList` y sólo `EmployeeList`.
 *
 * El trabajo concreto es **normalizar ausencias**: convertir los campos que
 * pueden no venir en valores que siempre existen. Eso es lo que quita los `??`
 * repartidos por el JSX, que era el objetivo.
 *
 * Lo que aquí NO se decide es cómo se ve una ausencia. Que un correo vacío se
 * pinte con una raya es cosa de la tabla, no del dominio: el mismo dato aparece
 * en el formulario de edición, donde una raya sería un texto que nadie escribió
 * y que se guardaría como si sí.
 */


/**
 * Un empleado del backend a uno del dominio.
 *
 * Está separado del de la lista porque `POST`, `PUT` y el detalle devuelven un
 * único objeto, y también tienen que pasar por aquí: si sólo se mapeara el
 * listado, el empleado recién creado entraría en la caché con la forma cruda
 * y sería la única fila de la tabla que no cumple el contrato.
 */
export const toEmployee = (employee: EmployeeListApiResponse): EmployeeList => ({
    id: employee.id,
    userName: employee.userName,

    // Cadena vacía y no la raya de "sin correo": `""` es falsy, así que la
    // tabla sigue distinguiendo el hueco y pintando su marca de posición, y el
    // formulario de edición abre el campo vacío en vez de con un `-` dentro
    // que se guardaría como correo de verdad.
    email: employee.email ?? "",
    firstName: employee.firstName,
    secondName: employee.secondName ?? "",
    firstLastName: employee.firstLastName,
    secondLastName: employee.secondLastName ?? "",

    // La fecha de nacimiento NO se formatea en el mapper: la consume también
    // el `<input type="date">` de la edición, y ese input sólo acepta el mismo
    // formato ISO en el que la manda el backend. Formatearla aquí la haría
    // ilegible para el control; de mostrarla con otro formato se encarga la
    // tabla cuando quiera.
    birthDate: employee.age,

    sex: employee.sex,
    phone: employee.phone ?? "",
    rolName: employee.rolName,
    rolScope: employee.rolScope,
    isActive: employee.isActive,

    // Ésta sí se formatea: es dato de la tabla y de nada más.
    updatedAt: formatDate(employee.updatedAt),
});


/** El listado completo. */
export const toEmployeeList = (
    employees: EmployeeListApiResponse[]
): EmployeeList[] => employees.map(toEmployee);


/** Convierte un empleado guardado en los valores que edita el formulario. */
export const toEmployeeFormValues = (employee: EmployeeList): EmployeeFormValues => ({
    userName: employee.userName,
    email: employee.email,
    firstName: employee.firstName,
    secondName: employee.secondName,
    firstLastName: employee.firstLastName,
    secondLastName: employee.secondLastName,
    birthDate: employee.birthDate,
    // El dominio guarda el valor crudo tal como lo manda el backend; el
    // formulario sólo admite las opciones de la lista, que es justo lo que ese
    // valor ya es. El `as` es la frontera entre los dos contratos. Si el rol
    // viene fuera del catálogo provisional, la edición abre el selector vacío
    // y la lista de roles hay que ampliarla, no adivinar un texto guardado.
    role: employee.rolName as EmployeeRole,
    // Igual pero con el sexo en mayúsculas que publica el backend.
    sex: employee.sex as EmployeeSex,
    phone: employee.phone,
    isActive: employee.isActive,
});


/**
 * El camino de vuelta: de lo que se escribió a lo que se manda al **crear**.
 *
 * Recorta los extremos —un nombre con espacios delante se ordena antes que
 * todos los demás en la tabla y nadie entiende por qué— y, si un campo opcional
 * queda vacío, **la propiedad desaparece** en lugar de viajar como `""`: son
 * dos cosas distintas para el backend, "no tiene" y "tiene una vacía".
 *
 * `isActive` no se incluye: al crear lo decide el servidor.
 */
export const toCreateEmployeeParams = (
    values: EmployeeFormValues
): CreateEmployeeParams => {
    const email = values.email.trim();
    const secondName = values.secondName.trim();
    const secondLastName = values.secondLastName.trim();
    const phone = values.phone.trim();

    return {
        userName: values.userName.trim(),
        // El rol es obligatorio —la validación lo garantiza— y viaja siempre:
        // `rolName` es el único dato que el formulario sí conoce del rol; el
        // `rolId` y el `rolScope` los resuelve el backend a partir de él.
        rolName: values.role,
        ...(email ? { email } : {}),
        firstName: values.firstName.trim(),
        ...(secondName ? { secondName } : {}),
        firstLastName: values.firstLastName.trim(),
        ...(secondLastName ? { secondLastName } : {}),
        birthDate: values.birthDate,
        // La validación de campo obligatorio garantiza que al enviarse hay un
        // valor; aquí se afirma el paso de la cadena vacía al tipo estricto.
        sex: values.sex as EmployeeSex,
        ...(phone ? { phone } : {}),
    };
};


/**
 * Lo mismo, más el estado, para la **edición**.
 *
 * Reutiliza el de creación en lugar de repetir el recorte y la omisión de cada
 * campo opcional. Así la diferencia entre los dos queda en una sola línea, que
 * es exactamente lo que se diferencian.
 */
export const toUpdateEmployeeParams = (
    values: EmployeeFormValues,
    current: EmployeeList
): UpdateEmployeeParams => ({
    ...toCreateEmployeeParams(values),

    // Ausente cuando no cambió.
    ...(values.isActive !== current.isActive ? { isActive: values.isActive } : {}),
});