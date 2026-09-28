"use client";

import React from "react";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { useClampedPage, usePagination } from "@/hooks";
import { CreateEmployeeParams, EmployeeList, EmployeesService, UpdateEmployeeParams } from "../interfaces";
import { DEFAULT_EMPLOYEES_PAGINATION, createEmployeesService, employeeKeys, employeesQueryOptions } from "../services";
import { useEmployeeFilters } from "./use-employee-filters";


/**
 * Listado de empleados —filtrado y paginado por el backend— junto con su alta,
 * su edición y su baja.
 *
 * Los filtros y la paginación viven dentro del hook y no en la pantalla: texto,
 * estado y página forman una sola pregunta al servidor, y separarlos abre la
 * ventana en la que la tabla enseña una respuesta y los controles describen
 * otra. La pantalla recibe `filters` y `pagination` ya montados.
 *
 * El orden de los pasos lo impone la dependencia entre ellos:
 *
 *   1. Los filtros, que publican su huella (`filters.key`).
 *   2. La página, que vuelve a la 1 en cuanto esa huella cambia.
 *   3. La consulta, que necesita las dos cosas para saber qué pedir.
 *   4. El ajuste de la página, que necesita el `total` de la consulta.
 */


/**
 * La lista vacía es una constante y no un `[]` literal.
 *
 * Se devuelve mientras no hay datos, y un array nuevo en cada render rompería
 * la igualdad por referencia de todo lo que la reciba: los `useCallback` de la
 * pantalla y el modelo de filas de la tabla se recrearían sin que hubiera
 * cambiado nada.
 */
const NO_EMPLOYEES: EmployeeList[] = [];


export function useEmployees() {
    const http = useHttpClient();
    const queryClient = useQueryClient();


    /*
     * Una sola instancia del servicio para todo el hook: la consulta y las
     * mutaciones trabajan sobre la misma. Se memoiza por `http` porque el
     * cliente sólo cambia si cambia el contexto.
     */
    const service = React.useMemo<EmployeesService>(
        () => createEmployeesService(http),
        [http]
    );


    const filters = useEmployeeFilters();


    /*
     * `resetKey` es lo que evita quedarse en la página 4 de un resultado que
     * ahora tiene una sola. Se le pasa la huella de los filtros en vez de un
     * efecto que llame a `pagination.reset()`: el hook la compara durante el
     * render, así que la vuelta a la página 1 y el cambio de filtro entran en
     * la misma consulta y no en dos. Ver `usePagination`.
     */
    const pagination = usePagination({
        initialPageSize: DEFAULT_EMPLOYEES_PAGINATION.pageSize,
        resetKey: filters.key,
    });


    /*
     * La clave y la función de consulta salen del servicio, que es de donde las
     * toma también la precarga del servidor. Aquí sólo se le suma lo propio del
     * cliente.
     */
    const query = useQuery({
        ...employeesQueryOptions(service, { ...pagination.params, ...filters.params }),

        /*
         * Al cambiar de página se mantiene en pantalla lo anterior mientras
         * llega lo nuevo. Sin esto cada clic en el pie vacía la tabla y la
         * vuelve a llenar: la altura del bloque salta y el estado vacío —"todavía
         * no hay empleados"— aparece un instante diciendo algo que es falso.
         */
        placeholderData: keepPreviousData,
    });


    // La última página puede desaparecer bajo los pies: al borrar el único
    // empleado que quedaba en ella, o al subir el tamaño de página.
    useClampedPage(pagination, query.data?.total);


    /**
     * Refresca todas las páginas del listado, no sólo la actual.
     *
     * Crear, editar o borrar un empleado reordena la colección entera: lo que
     * estaba en la página 2 pasa a la 3. Invalidar sólo la página visible
     * dejaría las demás en caché con datos que ya no son.
     */
    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });


    const createEmployee = useMutation({
        mutationFn: (params: CreateEmployeeParams) => service.create(params),
        onSuccess: invalidate,
        meta: { alertOnSuccess: true }
    });


    const updateEmployee = useMutation({
        mutationFn: ({ id, params }: { id: string, params: UpdateEmployeeParams }) =>
            service.update(id, params),

        onSuccess: invalidate,
        meta: { alertOnSuccess: true }
    });


    const deleteEmployee = useMutation({
        mutationFn: (id: string) => service.remove(id),
        onSuccess: invalidate,
        meta: { alertOnSuccess: true }
    });


    return {
        /** Los empleados de la página actual, ya mapeados y ya filtrados. */
        data: query.data?.rows ?? NO_EMPLOYEES,

        /**
         * Cuántos cumplen los filtros, en todas las páginas. Lo dice el backend.
         * Con la barra vacía es el equipo entero.
         */
        total: query.data?.total ?? 0,

        /** Estado de la barra: texto, estado y sus manejadores. */
        filters,

        /** Estado del pie: página, tamaño y sus manejadores. */
        pagination,

        error: query.error,
        isLoading: query.isLoading,
        isPending: query.isPending,
        isError: query.isError,

        create: createEmployee,
        update: updateEmployee,
        delete: deleteEmployee,
    };
}