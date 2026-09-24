import { ApiEnvelope, ApiResponseWithPagination, HttpRequestConfig } from "@/interfaces";
import { EmployeeList, EmployeeListParams, CreateEmployeeParams, UpdateEmployeeParams } from "../interfaces";

export interface EmployeesService {
    /**
     * Una página del listado, con los filtros ya aplicados por el backend.
     *
     * La paginación es obligatoria y va aparte de `config`: pedir "todos los
     * empleados" no es una opción que este servicio ofrezca, porque tampoco la
     * ofrece el backend. El contenido que devuelve trae `total` —el de los
     * resultados, no el del catálogo—, que es de donde sale el número de
     * páginas del pie.
     */
    list(
        params: EmployeeListParams,
        config?: HttpRequestConfig
    ): Promise<ApiResponseWithPagination<EmployeeList[]>>;

    /** Un empleado suelto. No pagina: su `content` es el empleado. */
    detail(
        id: string,
        config?: HttpRequestConfig
    ): Promise<EmployeeList>;

    create(
        payload: CreateEmployeeParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    update(
        id: string,
        payload: UpdateEmployeeParams,
        config?: HttpRequestConfig
    ): Promise<ApiEnvelope<null>>;

    remove(id: string, config?: HttpRequestConfig): Promise<unknown>;
}