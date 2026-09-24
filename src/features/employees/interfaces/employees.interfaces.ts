import type { PaginationParams } from "@/interfaces";


/**
 * Valores de sexo que publica el backend.
 *
 * Son las claves que el formulario y la tabla comparten: la traducción a
 * "Femenino" / "Masculino" vive en los mensajes, no aquí.
 */
export type EmployeeSex = "FEMALE" | "MALE";


/**
 * Roles de un empleado dentro del negocio.
 *
 * Son los `rolName` tal cual los publica el backend —«Cajero», no `CAJERO»—;
 * el `rolScope` lo deriva el servidor a partir de ellos, por eso aquí no vive.
 *
 * El catálogo es provisional, a la espera del endpoint que traiga los roles
 * reales del negocio. La constante `EMPLOYEE_ROLE_VALUES` se declara contra
 * este tipo con `satisfies`: ampliar la lista es tocar solo esa constante, y
 * si el formulario o los rótulos se quedan atrás, el compilador lo dice.
 */
export type EmployeeRole = "Cajero" | "Administrador" | "Mesero" | "Cocina";


/**
 * Respuesta cruda del backend.
 *
 * Forma tal cual la publica el servicio: los campos que el backend deja vacíos
 * llegan como `null` —email, segundos nombres, teléfono—, y el que el dominio
 * llama `birthDate` viaja aquí bajo el nombre `age`, pese a ser una fecha.
 * Arreglar esas dos cosas es trabajo del mapper, no de este tipo.
 */
export interface EmployeeListApiResponse {
    id: string;
    tenantId: string;
    branchId: string;
    rolId: string;
    rolName: string;
    rolScope: string;
    userName: string;
    email: string | null;
    firstName: string;
    secondName: string | null;
    firstLastName: string;
    secondLastName: string | null;
    /**
     * Fecha de nacimiento en ISO 8601 (`YYYY-MM-DD`).
     *
     * El backend la nombra `age` aunque es una fecha; se conserva ese nombre
     * porque es con el que llega el dato. El dominio la llama `birthDate` y la
     * renombra el mapper.
     */
    age: string;
    sex: string;
    phone: string | null;
    createdAt: string; // ISO 8601
    updatedAt: string; // ISO 8601
    isActive: boolean;
}


/**
 * Empleado del dominio, ya normalizado.
 *
 * Todo campo que el backend puede no mandar existe siempre: los `null` se
 * convierten en cadena vacía, de ahí que aquí no haya ni un `??` ni un campo
 * opcional que el JSX tenga que adivinar.
 *
 * `birthDate` se conserva en el formato del backend (`YYYY-MM-DD`) y **sin
 * formatear a propósito**: la consume la tabla y el `<input type="date">` del
 * formulario de edición, y ese input solo acepta el formato ISO. Formatearla
 * en el mapper rompería la edición.
 */
export interface EmployeeList {
    id: string;
    userName: string;
    /** Cadena vacía cuando el backend manda `null`. */
    email: string;
    firstName: string;
    /** Cadena vacía cuando el backend manda `null`. */
    secondName: string;
    firstLastName: string;
    /** Cadena vacía cuando el backend manda `null`. */
    secondLastName: string;
    /** Fecha de nacimiento en `YYYY-MM-DD`, sin formatear (ver arriba). */
    birthDate: string;
    /** Valores que publica el backend (`FEMALE` / `MALE`). */
    sex: string;
    /** Cadena vacía cuando el backend manda `null`. */
    phone: string;
    rolName: string;
    rolScope: string;
    isActive: boolean;
    /** Fecha de la última actualización, ya formateada para mostrarse. */
    updatedAt: string;
}


/**
 * Lo que se manda al crear un empleado.
 *
 * Sin `isActive`: el backend da de alta a todo empleado activo, y mandarlo
 * desde aquí sería duplicar esa regla en dos sitios que pueden discrepar. Los
 * campos opcionales viajan sin la clave cuando quedan vacíos —`""` significaría
 * "guarda una vacía" para el backend—; de eso se encarga el mapper.
 *
 * `tenantId`, `branchId`, `rolId` y `rolScope` no están: el inquilino lo pone
 * el servicio, y el servidor resuelve el `rolId` y el `rolScope` a partir del
 * `rolName` que el formulario manda. La sucursal la asigna el servidor o entra
 * cuando exista un catálogo del que elegir.
 */
export interface CreateEmployeeParams {
    userName: string;
    /** Rol dentro del negocio. El servidor lo traduce a `rolId` y `rolScope`. */
    rolName: string;
    /** Se omite cuando está vacío: `""` significaría "guarda una vacía". */
    email?: string;
    firstName: string;
    /** Se omite cuando está vacío. */
    secondName?: string;
    firstLastName: string;
    /** Se omite cuando está vacío. */
    secondLastName?: string;
    /** Fecha de nacimiento en `YYYY-MM-DD`, como la pide el backend. */
    birthDate: string;
    sex: EmployeeSex;
    /** Se omite cuando está vacío. */
    phone?: string;
}


/**
 * Lo que se manda al **editar**: lo mismo, más el estado.
 *
 * Aquí `isActive` sí es obligatorio, y por eso son dos tipos y no uno con el
 * campo opcional. El interruptor solo aparece al editar, así que ese es el
 * único momento en que alguien decide sobre él; con un `isActive?` compartido,
 * olvidarlo en la llamada compilaría sin protestar y se guardaría el empleado
 * perdiendo su estado.
 */
export type UpdateEmployeeParams = CreateEmployeeParams & {
    /** Ausente cuando no cambió respecto a lo guardado. */
    isActive?: boolean;
};


/* -------------------------------------------------------------------------- */
/*  Consulta del listado                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Filtros que entiende el backend.
 *
 * Los nombres son los suyos: `text` para el texto libre —que él busca en el
 * nombre, el usuario y el correo, por eso es uno y no tres— e `isActive` para
 * el estado laboral.
 *
 * Los dos son opcionales y se construyen **por omisión**: un filtro sin elegir
 * no se manda vacío. `?text=` o `?isActive=` no significan "sin filtro" para el
 * backend, significan "filtra por cadena vacía", y devolverían cero resultados.
 */
export interface EmployeeFilters {
    /** Texto libre. Ya recortado; si no hay nada que buscar, no está la clave. */
    text?: string;

    /** `true` sólo activos, `false` sólo inactivos, ausente ambos. */
    isActive?: boolean;
}


/**
 * Todo lo que define una página del listado: qué trozo y de qué resultados.
 *
 * Van juntos en un solo objeto porque juntos son la identidad de la respuesta,
 * y es exactamente lo que tiene que entrar en la clave de caché: la página 2 de
 * "Luna" no tiene nada que ver con la página 2 sin filtros.
 */
export type EmployeeListParams = PaginationParams & EmployeeFilters;