"use client";

import * as React from "react";

import { Select } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";

import type { FilterSelectProps } from "@/interfaces";
import { cn } from "@/lib/utils";
import { messages } from "@/messages";
import { CONTROL_SIZE, ICON_STROKE_BY_SIZE, Z_INDEX_CLASS } from "@/tokens";

import {
    filterSelectContentVariants,
    filterSelectIconVariants,
    filterSelectIndicatorVariants,
    filterSelectItemVariants,
    filterSelectListVariants,
    filterSelectTriggerVariants,
    filterSelectValueVariants,
} from "./filter-select.style";


/**
 * FilterSelect
 *
 * El desplegable de una barra de filtros: texto, un chevron que dice si está
 * abierto y, si hace falta, un icono delante. Sin borde y sin fondo hasta que
 * se pasa el puntero, momento en el que se comporta como un botón fantasma.
 *
 * Es el hermano sin marco de `InputSelector`, y la diferencia no es sólo de
 * pintura: aquel es un **combobox editable** —se escribe dentro para filtrar
 * la lista— y éste es un **select**, un botón que abre opciones. El cambio de
 * primitivo es lo que permite quitar el borde sin mentir: una caja con borde
 * invita a escribir, y aquí no se escribe. De paso desaparecen el cursor de
 * texto, el teclado en móvil y el estado "escrito a medias".
 *
 * No conoce el dominio: recibe opciones y valor activo, como `FilterTabs`.
 * La elección entre uno y otro es cuántas opciones hay — hasta tres o cuatro
 * que quepan en una fila, pestañas; a partir de ahí, este desplegable.
 *
 * Uso mínimo:
 *   <FilterSelect
 *        options={CATEGORY_STATUS_OPTIONS}
 *        value={status}
 *        onChange={setStatus}
 *        startIcon={ICON_TOKENS.FILTER}
 *        aria-label="Filtrar categorías por estado"
 *   />
 */
export default function FilterSelect({
    options,
    value,
    defaultValue,
    onChange,
    placeholder = messages.components.filterSelect.placeholder,
    startIcon: StartIcon,
    size = "md",
    align,
    fullWidth,
    disabled = false,
    id,
    name,
    "aria-label": ariaLabel,
    className,
    contentClassName,
}: FilterSelectProps) {
    // Los iconos de lucide se dimensionan por prop, no por clase, así que el
    // tamaño sale del mismo escalón que el resto del control. Mismo criterio
    // que `GenericButton`.
    const sizeToken = size ?? "md";
    const iconSize = CONTROL_SIZE[sizeToken].iconSize;
    const iconStroke = ICON_STROKE_BY_SIZE[sizeToken];

    const isControlled = value !== undefined;

    // `null` llega cuando se deselecciona; hacia fuera se traduce a cadena
    // vacía, que es el contrato que ya usan el resto de campos del sistema.
    const handleValueChange = React.useCallback(
        (next: string | null) => {
            onChange?.(next ?? "");
        },
        [onChange]
    );

    return (
        <Select.Root<string>
            // Con `items`, el disparador pinta la ETIQUETA de la opción activa
            // y no su valor: sin esto se leería "inactive" en vez de
            // "Inactivas".
            items={options}
            {...(isControlled ? { value } : { defaultValue })}
            onValueChange={handleValueChange}
            disabled={disabled}
            id={id}
            name={name}
            // Un filtro no secuestra la página: mientras se elige se sigue
            // viendo —y desplazando— la tabla que hay detrás, que es
            // justamente lo que se está acotando.
            modal={false}
        >
            <Select.Trigger
                aria-label={ariaLabel}
                className={cn(
                    filterSelectTriggerVariants({ size, align, fullWidth }),
                    className
                )}
            >
                {StartIcon && (
                    <StartIcon
                        size={iconSize}
                        strokeWidth={iconStroke}
                        aria-hidden="true"
                    />
                )}

                <Select.Value
                    placeholder={placeholder}
                    className={filterSelectValueVariants()}
                />

                <Select.Icon className={filterSelectIconVariants()}>
                    <ChevronDown
                        size={iconSize}
                        strokeWidth={iconStroke}
                        aria-hidden="true"
                    />
                </Select.Icon>
            </Select.Trigger>

            <Select.Portal>
                <Select.Positioner
                    sideOffset={4}
                    align="start"
                    // Por defecto Base UI monta el panel ENCIMA del disparador,
                    // cuadrando la opción activa con el texto del control. Aquí
                    // estorba: sin borde, el filtro no se distingue del panel
                    // que lo tapa y el conjunto parece haber saltado de sitio.
                    // Desplegado por debajo, el control sigue a la vista.
                    alignItemWithTrigger={false}
                    // El panel se monta en un portal: sale del contenedor y
                    // compite en la raíz con el chrome, así que necesita la
                    // capa flotante del sistema.
                    className={cn("isolate", Z_INDEX_CLASS.dropdown)}
                >
                    <Select.Popup
                        className={cn(filterSelectContentVariants(), contentClassName)}
                    >
                        <Select.List className={filterSelectListVariants()}>
                            {options.map((option) => {
                                const OptionIcon = option.icon;

                                return (
                                    <Select.Item
                                        key={option.value}
                                        value={option.value}
                                        disabled={option.disabled}
                                        className={filterSelectItemVariants({ size })}
                                    >
                                        {OptionIcon && (
                                            <OptionIcon
                                                size={iconSize}
                                                strokeWidth={iconStroke}
                                                aria-hidden="true"
                                            />
                                        )}

                                        <Select.ItemText className="truncate">
                                            {option.label}
                                        </Select.ItemText>

                                        {/* La marca, y no sólo el tinte de
                                            fondo: la opción activa tiene que
                                            leerse sin depender del color. */}
                                        <Select.ItemIndicator
                                            className={filterSelectIndicatorVariants()}
                                        >
                                            <Check
                                                size={iconSize}
                                                strokeWidth={iconStroke}
                                                aria-hidden="true"
                                            />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                );
                            })}
                        </Select.List>
                    </Select.Popup>
                </Select.Positioner>
            </Select.Portal>
        </Select.Root>
    );
}
