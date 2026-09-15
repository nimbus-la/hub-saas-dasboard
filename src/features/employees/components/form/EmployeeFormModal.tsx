"use client";

import * as React from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

import { GenericButton, InputSelector, Modal, Switch, TextField } from "@/components";
import {
    EMPLOYEE_ACTIVE_HINT,
    EMPLOYEE_FIELD_HINTS,
    EMPLOYEE_FORM_RULES,
    EMPLOYEE_MODAL_COPY,
    hasEmployeeChanges,
} from "@/features/employees/libs/employee-form";
import { EMPLOYEE_ROLE_OPTIONS, EMPLOYEE_SEX_OPTIONS } from "@/features/employees/libs/employees-const.libs";
import { messages } from "@/messages";

import { EmployeeFormValues, EmployeeList } from "../../interfaces";
import {
    employeeFormModalGridVariants,
    employeeFormModalToggleVariants,
    employeeFormModalVariants,
} from "./employee-form-modal.style";



/** Une el `<form>` del cuerpo con su botón de envío, que vive en el pie. */
const FORM_ID = "employee-form";


interface EmployeeFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;

    /**
     * Empleado que se edita.
     *
     * Su ausencia es la que pone el modal en modo alta: no hace falta un
     * `mode` aparte porque no existe la combinación "editar sin empleado".
     */
    employee?: EmployeeList | undefined;

    /**
     * Recibe los valores ya validados. Cerrar el modal es cosa de quien lo abre.
     *
     * Puede devolver una promesa: mientras esté pendiente, react-hook-form
     * mantiene `isSubmitting` y el botón de envío se deshabilita solo. Es lo
     * que impide que un segundo clic cree el empleado dos veces.
     */
    onSubmit: (values: EmployeeFormValues) => void | Promise<void>;

    className?: string;
}


export default function EmployeeFormModal({
    open,
    onOpenChange,
    employee,
    onSubmit,
    className,
}: EmployeeFormModalProps) {
    const message = messages.employees.form;
    const { control, formState, handleSubmit } = useFormContext<EmployeeFormValues>();


    const mode = employee ? "edit" : "create";
    const generalMessage = EMPLOYEE_MODAL_COPY[mode];


    /*
     * Lo escrito ahora mismo, para decidir si el botón se puede pulsar.
     *
     * Se vigilan los campos por nombre —y no el formulario entero— porque
     * `useWatch` sin `name` devuelve los valores como parciales y obligaría a
     * un `?? ""` por campo justo donde se compara si algo cambió.
     */
    const [userName, email, firstName, secondName, firstLastName, secondLastName, birthDate, role, sex, phone, isActive] = useWatch({
        control,
        name: [
            "userName",
            "email",
            "firstName",
            "secondName",
            "firstLastName",
            "secondLastName",
            "birthDate",
            "role",
            "sex",
            "phone",
            "isActive",
        ],
    });


    /**
     * Cuándo se puede enviar.
     *
     * Dos condiciones, y la segunda solo al editar: el formulario tiene que ser
     * válido —mismas reglas en los dos modos— y, si se está editando, algo
     * tiene que haber cambiado respecto a lo guardado. Reabrir un empleado,
     * mirarlo y pulsar "Guardar cambios" mandaría una petición que no cambia
     * nada, así que hasta que se toque un campo el botón se queda apagado.
     *
     * `isValid` viene de react-hook-form, que revalida el formulario entero en
     * cada cambio; así el botón se enciende y se apaga solo, sin repetir aquí
     * ninguna de las reglas.
     */
    const hasChanges =
        !employee || hasEmployeeChanges(
            {
                userName,
                email,
                firstName,
                secondName,
                firstLastName,
                secondLastName,
                birthDate,
                role,
                sex,
                phone,
                isActive,
            },
            employee
        );

    const canSubmit = formState.isValid && hasChanges && !formState.isSubmitting;


    /*
     * El foco entra por el usuario.
     *
     * Sin esto Base UI enfoca el primer elemento tabulable, que es la equis de
     * la cabecera: quien navega con teclado empezaría por la salida en lugar de
     * por el primer campo. La referencia se comparte con react-hook-form —que
     * usa la suya para llevar el foco al primer campo que falla al enviar—, de
     * ahí que se asignen las dos en el mismo callback.
     */
    const userNameFieldRef = React.useRef<HTMLInputElement>(null);


    return (
        <Modal
            open={open}
            onOpenChange={onOpenChange}
            title={generalMessage.title}
            description={generalMessage.description}
            size="lg"
            initialFocus={userNameFieldRef}
            closeLabel={message.close}
            // Con cambios sin guardar, un clic fuera tira el trabajo. `Escape`,
            // la equis y "Cancelar" siguen cerrando: quitar también esas tres
            // dejaría el modal sin salida por teclado.
            disableDismiss={formState.isDirty}
            className={className}
            footer={
                <>
                    <GenericButton
                        type="button"
                        variant="ghost"
                        label={messages.common.actions.cancel}
                        onClick={() => onOpenChange(false)}
                        className="border border-neutral-300"
                    />

                    {/* El botón vive en el pie del modal, fuera del `<form>`,
                        así que lo enlaza por `form=`: es lo que permite que el
                        pie mantenga su geometría sin envolver todo el panel en
                        el formulario. */}
                    <GenericButton
                        type="submit"
                        form={FORM_ID}
                        label={generalMessage.submit}
                        disabled={!canSubmit}
                    />
                </>
            }
        >
            <form
                id={FORM_ID}
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className={employeeFormModalVariants()}
            >
                <Controller
                    control={control}
                    name="userName"
                    rules={EMPLOYEE_FORM_RULES.userName}
                    render={({ field, fieldState }) => (
                        <TextField
                            {...field}
                            ref={(node) => {
                                field.ref(node);
                                userNameFieldRef.current = node;
                            }}
                            label={message.userName.label}
                            required
                            error={fieldState.error?.message ?? false}
                            placeholder={message.userName.placeholder}
                            helperText={EMPLOYEE_FIELD_HINTS.userName}
                            autoComplete="off"
                        />
                    )}
                />

                {/* El rol es el dato de negocio: quién opera y con qué alcance.
                    Comparte fila completa con el usuario, igual de protagonista,
                    y deja la rejilla de datos personales intacta y en pares. */}
                <Controller
                    control={control}
                    name="role"
                    rules={EMPLOYEE_FORM_RULES.role}
                    render={({ field, fieldState }) => (
                        <InputSelector
                            {...field}
                            label={message.role.label}
                            required
                            error={fieldState.error?.message ?? false}
                            placeholder={message.role.placeholder}
                            helperText={message.role.helper}
                            options={EMPLOYEE_ROLE_OPTIONS}
                            clearable={false}
                        />
                    )}
                />

                <div className={employeeFormModalGridVariants()}>
                    <Controller
                        control={control}
                        name="firstName"
                        rules={EMPLOYEE_FORM_RULES.firstName}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label={message.firstName.label}
                                required
                                error={fieldState.error?.message ?? false}
                                placeholder={message.firstName.placeholder}
                                helperText={EMPLOYEE_FIELD_HINTS.firstName}
                                autoComplete="off"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="secondName"
                        rules={EMPLOYEE_FORM_RULES.secondName}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label={message.secondName.label}
                                error={fieldState.error?.message ?? false}
                                placeholder={message.secondName.placeholder}
                                helperText={EMPLOYEE_FIELD_HINTS.secondName}
                                autoComplete="off"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="firstLastName"
                        rules={EMPLOYEE_FORM_RULES.firstLastName}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label={message.firstLastName.label}
                                required
                                error={fieldState.error?.message ?? false}
                                placeholder={message.firstLastName.placeholder}
                                helperText={EMPLOYEE_FIELD_HINTS.firstLastName}
                                autoComplete="off"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="secondLastName"
                        rules={EMPLOYEE_FORM_RULES.secondLastName}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                label={message.secondLastName.label}
                                error={fieldState.error?.message ?? false}
                                placeholder={message.secondLastName.placeholder}
                                helperText={EMPLOYEE_FIELD_HINTS.secondLastName}
                                autoComplete="off"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="birthDate"
                        rules={EMPLOYEE_FORM_RULES.birthDate}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                type="date"
                                label={message.birthDate.label}
                                required
                                error={fieldState.error?.message ?? false}
                                placeholder={message.birthDate.placeholder}
                                helperText={message.birthDate.helper}
                                autoComplete="off"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="sex"
                        rules={EMPLOYEE_FORM_RULES.sex}
                        render={({ field, fieldState }) => (
                            <InputSelector
                                {...field}
                                label={message.sex.label}
                                required
                                error={fieldState.error?.message ?? false}
                                placeholder={message.sex.placeholder}
                                helperText={message.sex.helper}
                                options={EMPLOYEE_SEX_OPTIONS}
                                clearable={false}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        rules={EMPLOYEE_FORM_RULES.email}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                type="email"
                                label={message.email.label}
                                error={fieldState.error?.message ?? false}
                                placeholder={message.email.placeholder}
                                helperText={EMPLOYEE_FIELD_HINTS.email}
                                autoComplete="email"
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="phone"
                        rules={EMPLOYEE_FORM_RULES.phone}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                type="tel"
                                label={message.phone.label}
                                error={fieldState.error?.message ?? false}
                                placeholder={message.phone.placeholder}
                                helperText={EMPLOYEE_FIELD_HINTS.phone}
                                autoComplete="tel"
                            />
                        )}
                    />
                </div>

                {/* Solo al editar: un empleado nuevo nace activo —nadie da de
                    alta a alguien que no va a operar— y ofrecer el interruptor
                    en el alta solo añade una decisión que no toca tomar todavía. */}
                {mode === "edit" && (
                    <Controller
                        control={control}
                        name="isActive"
                        render={({ field }) => (
                            <div className={employeeFormModalToggleVariants()}>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    name={field.name}
                                    label={message.activeLabel}
                                    description={
                                        field.value
                                            ? EMPLOYEE_ACTIVE_HINT.on
                                            : EMPLOYEE_ACTIVE_HINT.off
                                    }
                                />
                            </div>
                        )}
                    />
                )}
            </form>
        </Modal>
    );
}