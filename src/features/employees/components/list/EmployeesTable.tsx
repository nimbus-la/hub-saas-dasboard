"use client";

import type { ColumnDef } from "@tanstack/react-table";

import StatusBadge from "@/components/badges/StatusBadge";
import GenericButton from "@/components/buttons/GenericButton";
import DataTable from "@/components/tables/DataTable";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";

import { ICON_TOKENS } from "@/tokens";

import { EmployeeList } from "../../interfaces";
import {
    EMPTY_VALUE,
    formatEmployeeFullName,
    formatEmployeeStatus,
    getEmployeeStatusTone,
} from "../../libs";
import {
    employeesTableActionsVariants,
    employeesTableDeleteVariants,
    employeesTableEmptyValueVariants,
    employeesTableNameVariants,
    employeesTablePanelVariants,
    employeesTableUserNameVariants,
} from "./employees-table.style";


/** Lo que dice esta tabla. Ver `@/messages`. */
const message = messages.employees.table;


/**
 * Tabla de empleados.
 *
 * Envuelve al `DataTable` del sistema con las columnas del dominio. No guarda
 * estado: recibe la lista ya filtrada y devuelve la intención —editar,
 * eliminar— hacia arriba. Confirmar el borrado no es cosa suya: la fila solo
 * avisa de que alguien lo pidió.
 */


// ── Columnas ────────────────────────────────────────────────────────────────
// Constante de módulo: la referencia es estable entre renders, así el DataTable
// no recalcula su modelo de columnas innecesariamente.
const employeeColumns: ColumnDef<EmployeeList>[] = [
    {
        accessorKey: "userName",
        header: message.userName,
        meta: { headerClassName: "w-40", cellClassName: "w-40" },
        cell: ({ row }) => (
            <span className={employeesTableUserNameVariants()}>
                {row.original.userName}
            </span>
        ),
    },
    {
        accessorKey: "firstName",
        header: message.fullName,
        meta: { headerClassName: "w-56", cellClassName: "w-56" },
        // El orden alfabético del nombre compuesto lo decide el backend; aquí
        // las dos columnas del nombre viven juntas en una sola celda.
        cell: ({ row }) => (
            <span className={employeesTableNameVariants()}>
                {formatEmployeeFullName(row.original)}
            </span>
        ),
    },
    {
        accessorKey: "email",
        header: message.email,
        enableSorting: false,
        cell: ({ row }) => {
            const { email } = row.original;

            if (!email) {
                return (
                    <span
                        className={employeesTableEmptyValueVariants()}
                        aria-label={message.noEmail}
                    >
                        {EMPTY_VALUE}
                    </span>
                );
            }

            return (
                <span className="truncate text-neutral-600" title={email}>
                    {email}
                </span>
            );
        },
    },
    {
        accessorKey: "rolName",
        header: message.role,
        meta: { headerClassName: "w-32", cellClassName: "w-32" },
        enableSorting: false,
        cell: ({ row }) => (
            <span className="text-neutral-600">{row.original.rolName}</span>
        ),
    },
    {
        accessorKey: "isActive",
        header: message.status,
        meta: { headerClassName: "w-32", cellClassName: "w-32" },
        cell: ({ row }) => (
            <StatusBadge
                tone={getEmployeeStatusTone(row.original.isActive)}
                label={formatEmployeeStatus(row.original.isActive)}
            />
        ),
    },
    {
        accessorKey: "updatedAt",
        header: message.updatedAt,
        meta: { headerClassName: "w-32", cellClassName: "w-32" },
        cell: ({ row }) => {
            const { updatedAt } = row.original;

            return (
                <time dateTime={updatedAt} className="tabular-nums">
                    {updatedAt}
                </time>
            );
        },
    },
];


interface EmployeesTableProps {
    employees: EmployeeList[];
    onEditEmployee: (employee: EmployeeList) => void;
    onDeleteEmployee: (employee: EmployeeList) => void;
    /** Qué decir cuando no hay filas. Cambia según haya filtros puestos. */
    emptyMessage: string;
    className?: string;
}


export default function EmployeesTable({
    employees,
    onEditEmployee,
    onDeleteEmployee,
    emptyMessage,
    className,
}: EmployeesTableProps) {
    return (
        <div className={cn(employeesTablePanelVariants(), className)}>
            <DataTable
                data={employees}
                columns={employeeColumns}
                enableRowSelection
                getRowId={(employee) => employee.id}
                emptyMessage={emptyMessage}
                renderRowActions={(employee) => (
                    <div className={employeesTableActionsVariants()}>
                        {/* La etiqueta nombra al empleado y no solo la acción:
                            con ocho filas iguales, ocho botones que dicen
                            "Editar" no se distinguen entre sí al navegar por
                            la lista de controles de un lector de pantalla. */}
                        <GenericButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            icon={ICON_TOKENS.EDIT}
                            aria-label={formatMessage(message.editEmployee, {
                                name: formatEmployeeFullName(employee) || employee.userName,
                            })}
                            title={message.edit}
                            onClick={() => onEditEmployee(employee)}
                        />

                        <GenericButton
                            type="button"
                            variant="danger"
                            size="sm"
                            icon={ICON_TOKENS.DELETE}
                            aria-label={formatMessage(message.deleteEmployee, {
                                name: formatEmployeeFullName(employee) || employee.userName,
                            })}
                            title={message.delete}
                            onClick={() => onDeleteEmployee(employee)}
                            className={employeesTableDeleteVariants()}
                        />
                    </div>
                )}
            />
        </div>
    );
}