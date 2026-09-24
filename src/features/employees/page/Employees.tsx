"use client";

import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ConfirmDialog, notify, PageHeader, Pagination, StatusBadge } from "@/components";
import { getApiErrorMessage } from "@/lib/http";
import { formatMessage, messages } from "@/messages";

import { EmployeeFormModal, EmployeesTable, EmployeesToolbar } from "../components";
import { useEmployees } from "../hooks";
import type { EmployeeFormValues, EmployeeList } from "../interfaces";
import {
    EMPTY_EMPLOYEE_FORM_VALUES,
    formatEmployeeCount,
    formatEmployeeFullName,
    getEmployeeEmptyMessage,
} from "../libs";
import { toCreateEmployeeParams, toEmployeeFormValues, toUpdateEmployeeParams } from "../mappers";
import {
    employeesPageBodyVariants,
    employeesPagePaginationVariants,
    employeesPageVariants,
} from "../style";


/**
 * Pantalla de empleados: listado con su barra de filtros, su pie de
 * paginación, el modal de alta y edición, y el diálogo de borrado.
 *
 * Los datos y los filtros los gobierna `useEmployees`. Lo que queda aquí es la
 * composición de la vista y el estado de los diálogos: qué modal está abierto
 * y sobre qué empleado.
 */
export default function Employees() {
    const employees = useEmployees();

    // Esta pantalla no filtra nada: el backend devuelve la página ya filtrada y
    // el hook mueve texto, estado y página a la vez. Aquí sólo se enchufan los
    // controles.
    const { filters, pagination } = employees;


    const form = useForm<EmployeeFormValues>({
        defaultValues: EMPTY_EMPLOYEE_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange",
    });


    const message = messages.employees;


    // ── Formulario ──────────────────────────────────────────────────────────
    // Un solo modal para el alta y la edición; el modo lo decide `formTarget`.
    // `null` significa alta, no "todavía no se sabe": el modal está cerrado
    // hasta que alguien pulsa, así que no hace falta un tercer estado.
    const [formTarget, setFormTarget] = React.useState<EmployeeList | null>(null);
    const [isFormOpen, setIsFormOpen] = React.useState<boolean>(false);

    // ── Borrado ─────────────────────────────────────────────────────────────
    // Dos estados y no uno: `deleteTarget` dice qué se va a borrar y
    // `isDeleteOpen` si el diálogo se ve. Vaciar el objetivo al cerrar dejaría
    // el diálogo sin título ni descripción durante su animación de salida, así
    // que se queda hasta que la siguiente fila lo reemplaza.
    const [deleteTarget, setDeleteTarget] = React.useState<EmployeeList | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);


    const handleCreateEmployee = React.useCallback(() => {
        setFormTarget(null);
        form.reset(EMPTY_EMPLOYEE_FORM_VALUES);
        setIsFormOpen(true);
    }, []);


    const handleEditEmployee = React.useCallback((employee: EmployeeList) => {
        setFormTarget(employee);

        // Los valores de la edición salen del dominio ya normalizado, no de la
        // tabla que los pinta: así el modal nunca ve ni un `null` ni una raya.
        form.reset(toEmployeeFormValues(employee));

        setIsFormOpen(true);
    }, []);


    /**
     * Guarda el alta o la edición.
     *
     * Es `async` para que react-hook-form mantenga `isSubmitting` mientras la
     * petición viaja: eso deshabilita el botón de envío y evita el doble clic
     * que crearía el empleado dos veces.
     *
     * El modal se cierra sólo si el guardado salió bien. Si falla se queda
     * abierto con lo que se escribió y el motivo encima, en vez de obligar a
     * reescribirlo entero.
     */
    const handleFormSubmit = React.useCallback(
        async (values: EmployeeFormValues) => {

            try {
                // Cada modo arma su propio cuerpo. El alta no manda `isActive`
                // porque el backend crea a todo empleado activo; la edición sí,
                // que es cuando alguien decide sobre el interruptor.
                if (formTarget) {
                    await employees.update.mutateAsync({
                        id: formTarget.id,
                        params: toUpdateEmployeeParams(values, formTarget),
                    });
                } else {
                    await employees.create.mutateAsync(toCreateEmployeeParams(values));
                }

                form.reset(EMPTY_EMPLOYEE_FORM_VALUES);
                setIsFormOpen(false);
            } catch (error: unknown) {
                const errorMessage = getApiErrorMessage(error);
                notify.error(errorMessage);
            }
        },
        [formTarget, employees.create, employees.update]
    );


    const handleDeleteRequest = React.useCallback((employee: EmployeeList) => {
        setDeleteTarget(employee);
        setIsDeleteOpen(true);
    }, []);


    /**
     * Confirma el borrado.
     *
     * El diálogo se cierra al resolverse la promesa y no antes; hasta entonces
     * `loading` mantiene el botón ocupado. Por eso cerrarlo es cosa de esta
     * pantalla y no del propio diálogo.
     */
    const handleDeleteConfirm = React.useCallback(async () => {
        if (!deleteTarget) return;

        try {
            await employees.delete.mutateAsync(deleteTarget.id);
            setIsDeleteOpen(false);
        } catch (error: unknown) {
            // El diálogo se queda abierto para poder reintentar.
            const errorMessage = getApiErrorMessage(error);
            notify.error(errorMessage);
        }
    }, [deleteTarget, employees.delete]);


    return (
        <FormProvider {...form}>
            <div className={employeesPageVariants()}>
                <PageHeader
                    title={message.title}
                    subtitle={message.subtitle}
                    badge={
                        <StatusBadge
                            size="xs"
                            tone="neutral"
                            label={formatEmployeeCount(employees.total)}
                            className="tabular-nums"
                        />
                    }
                />

                <section className={employeesPageBodyVariants()}>
                    {/* Los manejadores del buscador y del selector son los del
                        hook, sin envolver: la espera del buscador y la vuelta a
                        la primera página ya están resueltas ahí dentro. */}
                    <EmployeesToolbar
                        query={filters.query}
                        onQueryChange={filters.setQuery}
                        status={filters.status}
                        onStatusChange={filters.setStatus}
                        onCreateEmployee={handleCreateEmployee}
                        visibleCount={employees.data.length}
                        totalCount={employees.total}
                        onClearFilters={filters.clear}
                    />

                    <EmployeesTable
                        employees={employees.data}
                        onEditEmployee={handleEditEmployee}
                        onDeleteEmployee={handleDeleteRequest}
                        emptyMessage={getEmployeeEmptyMessage({
                            isPending: employees.isLoading,
                            isError: employees.isError,
                            // El texto aplicado, no el que se está tecleando:
                            // la tabla está vacía por culpa del primero.
                            query: filters.params.text ?? "",
                            status: filters.status,
                        })}
                    />

                    {/* El pie sólo aparece cuando hay algo que paginar; sobre un
                        equipo vacío no añade nada al mensaje de la tabla. El
                        total es el del backend, no el de las filas visibles. */}
                    {employees.total > 0 && (
                        <Pagination
                            page={pagination.pageNumber}
                            pageSize={pagination.pageSize}
                            totalItems={employees.total}
                            onPageChange={pagination.goToPage}
                            onPageSizeChange={pagination.changePageSize}
                            itemLabel={message.itemLabel}
                            className={employeesPagePaginationVariants()}
                        />
                    )}
                </section>

                <EmployeeFormModal
                    open={isFormOpen}
                    onOpenChange={setIsFormOpen}
                    employee={formTarget ?? undefined}
                    onSubmit={handleFormSubmit}
                />

                {/* El diálogo cuelga de la pantalla y no de la fila: la tabla
                    sólo avisa de que alguien pidió borrar, y quien decide qué
                    hacer con esa intención es esta pantalla. */}
                {deleteTarget && (
                    <ConfirmDialog
                        open={isDeleteOpen}
                        onOpenChange={setIsDeleteOpen}
                        title={message.delete.title}
                        description={formatMessage(message.delete.description, {
                            name:
                                formatEmployeeFullName(deleteTarget) || deleteTarget.userName,
                        })}
                        confirmLabel={message.delete.confirm}
                        cancelLabel={message.delete.cancel}
                        onConfirm={handleDeleteConfirm}
                        loading={employees.delete.isPending}
                    />
                )}
            </div>
        </FormProvider>
    );
}