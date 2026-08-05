import { ButtonProps } from "@/interfaces";
import { CONTROL_SIZE, ICON_STROKE_BY_SIZE } from "@/tokens";

import { genericButtonVariants } from "./generic-button.style";


export default function GenericButton({
    label,
    variant,
    size = "md",
    align,
    iconOnly,
    fullWidth,
    startIcon: StartIcon,
    endIcon: EndIcon,
    icon: IconComponent,
    selected = false,
    disabled = false,
    className,
    ...props
}: ButtonProps) {
    const isIconOnly = iconOnly ?? (!label && !!IconComponent);

    // Los iconos de lucide se dimensionan por prop, no por clase, así que el
    // tamaño sale del mismo escalón que el resto del botón. El trazo se afina
    // conforme el icono crece: a 24px un trazo de 2px se ve tosco.
    const sizeToken = size ?? "md";
    const iconSize = CONTROL_SIZE[sizeToken].iconSize;
    const iconStroke = ICON_STROKE_BY_SIZE[sizeToken];

    return (
        <button
            disabled={disabled}
            data-selected={selected}
            className={genericButtonVariants({ variant, size, align, iconOnly, fullWidth, className })}
            {...props}
        >
            {isIconOnly && IconComponent && (
                <IconComponent size={iconSize} strokeWidth={iconStroke} />
            )}


            {/* ── Modo icono + texto ───────────────────────────────────── */}
            {!isIconOnly && (
                <>
                    {StartIcon && (
                        <StartIcon size={iconSize} strokeWidth={iconStroke} />
                    )}

                    {label}

                    {EndIcon && (
                        <EndIcon size={iconSize} strokeWidth={iconStroke} />
                    )}
                </>
            )}
        </button>
    );
};
