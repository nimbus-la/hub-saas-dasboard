import type { EmployeeRole, EmployeeSex } from "./employees.interfaces";

/**
 * Valores del formulario de empleado
 *
 * **Un solo tipo para el alta y para la edición.** Los dos modos comparten
 * campos, reglas y mensajes; lo único que cambia es si el interruptor de estado
 * se enseña o no, y eso es una decisión de pintado, no de datos.
 *
 * Todos los campos son obligatorios, y eso no es un descuido: react-hook-form
 * alimenta con esto controles **controlados**, y un control controlado necesita
 * un valor concreto en cada render. Declarar `email?: string` hace que el
 * `<TextField value={...}>` reciba `string | undefined`, que React interpreta
 * como "este campo pasa a ser no controlado" — el aviso clásico de *"a component
 * is changing a controlled input to be uncontrolled"*, con el cursor saltando al
 * final del texto al escribir.
 *
 * La ausencia se representa con el **valor vacío** del tipo, no quitando la
 * propiedad: `""` para el texto, `""` para el sexo antes de elegir, `true` para
 * el estado inicial. Convertir eso en lo que espera la API —donde un correo
 * vacío sí se omite— es trabajo de `toCreateEmployeeParams` y
 * `toUpdateEmployeeParams`, en la frontera.
 */
export interface EmployeeFormValues {
    userName: string;
    /** Cadena vacía = no hay correo. */
    email: string;
    firstName: string;
    /** Cadena vacía = no tiene segundo nombre. */
    secondName: string;
    firstLastName: string;
    /** Cadena vacía = no tiene segundo apellido. */
    secondLastName: string;
    /** `YYYY-MM-DD`, el formato que acepta el `<input type="date">`. */
    birthDate: string;
    /**
     * Cadena vacía hasta elegir una opción.
     *
     * Se limita a las opciones del catálogo —y no se acepta cualquier string,
     * a diferencia del `sex`— porque el backend publica *cada* sexo pero solo
     * los `rolName` que el negocio conoce. Si un empleado trae un rol fuera de
     * la lista, el selector abre vacío y hay que ampliar `EMPLOYEE_ROLE_VALUES`.
     */
    role: EmployeeRole | "";
    /** Cadena vacía hasta elegir una opción. */
    sex: EmployeeSex | "";
    /** Cadena vacía = no tiene teléfono. */
    phone: string;
    isActive: boolean;
}