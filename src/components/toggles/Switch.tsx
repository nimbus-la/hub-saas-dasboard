"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";
import type { SwitchProps } from "@/interfaces";

import {
    switchDescriptionVariants,
    switchLabelVariants,
    switchThumbVariants,
    switchTrackVariants,
    switchVariants,
} from "./switch.style";

export function Switch({
    checked,
    defaultChecked,
    onCheckedChange,
    label,
    description,
    disabled = false,
    size = "md",
    id,
    name,
    className,
    trackClassName,
    ...props
}: SwitchProps) {
    const reactId = React.useId();
    const fieldId = id ?? reactId;
    const descriptionId = description ? `${fieldId}-description` : undefined;

    const control = (
        <SwitchPrimitive.Root
            id={fieldId}
            name={name}
            checked={checked}
            defaultChecked={defaultChecked}
            onCheckedChange={onCheckedChange}
            disabled={disabled}
            aria-describedby={descriptionId}
            className={cn(switchTrackVariants({ size }), trackClassName)}
            {...props}
        >
            <SwitchPrimitive.Thumb className={switchThumbVariants({ size })} />
        </SwitchPrimitive.Root>
    );

    if (!label) {
        return <span className={className}>{control}</span>;
    }

    return (
        <div className={cn(switchVariants(), className)}>
            <div className="min-w-0">
                <label
                    htmlFor={fieldId}
                    className={switchLabelVariants({ size, disabled })}
                >
                    {label}
                </label>

                {description && (
                    <p
                        id={descriptionId}
                        className={switchDescriptionVariants({ disabled })}
                    >
                        {description}
                    </p>
                )}
            </div>

            {control}
        </div>
    );
}
