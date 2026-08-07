"use client";

// ── Formulario de la categoría ──────────────────────────────────────────────
// Compone react-hook-form con el ciclo de vida del modal y devuelve una sola
// API al componente. El borrador, los errores y qué campo está tocado los
// lleva la librería; aquí vive lo que ella no sabe: con qué valores hay que
// arrancar cada vez que el modal se abre, y que el nombre no puede repetirse.

import * as React from "react";
import { useForm } from "react-hook-form";

import {
    CATEGORY_FORM_RULES,
    EMPTY_CATEGORY_FORM_VALUES,
    duplicateCategoryNameMessage,
    toCategoryFormValues,
    type CategoryFormValues,
} from "@/features/products/libs/category-form";
import type { Category } from "@/features/products/interfaces";

interface UseCategoryFormOptions {
    /** El modal está abierto. Es la señal para (re)cargar el borrador. */
    open: boolean;
    /** Categoría que se edita. Sin ella, el formulario arranca vacío. */
    category?: Category | undefined;
    /** ¿Ya hay otra categoría con este nombre? La respuesta la tiene la pantalla. */
    isNameTaken: (name: string) => boolean;
}

export function useCategoryForm({
    open,
    category,
    isNameTaken,
}: UseCategoryFormOptions) {
    /*
     * `onTouched`: el primer aviso llega al salir del campo y, a partir de ahí,
     * se revalida en cada tecla. Un campo obligatorio está vacío desde el
     * primer render, así que validar antes de que nadie lo toque sería regañar
     * por adelantado; una vez que el mensaje está en pantalla, mantenerlo
     * mientras se corrige convierte cada tecla en un reproche.
     */
    const form = useForm<CategoryFormValues>({
        defaultValues: EMPTY_CATEGORY_FORM_VALUES,
        mode: "onTouched",
        reValidateMode: "onChange",
    });

    const { reset } = form;

    /*
     * El borrador se recarga al abrir, no al montar.
     *
     * El modal no se desmonta entre aperturas —Base UI lo conserva para poder
     * animar la salida—, así que sin esto la segunda vez que se abre aparecen
     * los valores de la primera: los datos de la categoría anterior en el
     * formulario de la siguiente, o un error en rojo sobre un campo que nadie
     * ha tocado todavía.
     */
    React.useEffect(() => {
        if (!open) return;

        reset(
            category ? toCategoryFormValues(category) : EMPTY_CATEGORY_FORM_VALUES
        );
    }, [open, category, reset]);

    /**
     * Reglas del nombre, con la unicidad añadida.
     *
     * `validate` pasa a ser un objeto de comprobaciones con nombre: es la
     * forma que tiene react-hook-form de acumular varias sin que una pise a la
     * otra. La de longitud es la que ya venía del dominio; la de unicidad
     * necesita el resto de categorías, que el dominio no conoce.
     */
    const nameRules = React.useMemo(
        () => ({
            ...CATEGORY_FORM_RULES.name,
            validate: {
                length: CATEGORY_FORM_RULES.name.validate,
                unique: (value: string) =>
                    !isNameTaken(value) || duplicateCategoryNameMessage(value),
            },
        }),
        [isNameTaken]
    );

    return { form, nameRules };
}
