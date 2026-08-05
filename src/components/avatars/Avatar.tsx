"use client"

import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import type {
    AvatarBadgeProps,
    AvatarFallbackProps,
    AvatarGroupCountProps,
    AvatarGroupProps,
    AvatarImageProps,
    AvatarProps,
} from "@/interfaces"
import { cn } from "@/lib/utils"

import {
    avatarBadgeVariants,
    avatarFallbackVariants,
    avatarGroupCountVariants,
    avatarGroupVariants,
    avatarImageVariants,
    avatarVariants,
} from "./avatar.style"


/**
 * Avatar
 * 
 * Base UI se encarga de la carga de la imagen y del salto a las iniciales
 * cuando no hay foto o falla; aquí solo se decide la estructura y se 
 * enchufan los estilos del sistema.
 * 
 * El tamaño se pasa una sola vez, a la raíz, y baja al resto por el
 * `data-size`. Así no hay forma de dejar unas iniciales de 18px dentro de
 * un círculo de 24.
 */


function Avatar({ className, size = "md", ...props }: AvatarProps) {
    return (
        <AvatarPrimitive.Root
            data-slot="avatar"
            data-size={size}
            className={cn(avatarVariants({ size }), className)}
            {...props}
        />
    )
}

function AvatarImage({ className, ...props }: AvatarImageProps) {
    return (
        <AvatarPrimitive.Image
            data-slot="avatar-image"
            className={cn(avatarImageVariants(), className)}
            {...props}
        />
    )
}

function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
    return (
        <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className={cn(avatarFallbackVariants(), className)}
            {...props}
        />
    )
}

function AvatarBadge({ className, ...props }: AvatarBadgeProps) {
    return (
        <span
            data-slot="avatar-badge"
            className={cn(avatarBadgeVariants(), className)}
            {...props}
        />
    )
}

function AvatarGroup({ className, ...props }: AvatarGroupProps) {
    return (
        <div
            data-slot="avatar-group"
            className={cn(avatarGroupVariants(), className)}
            {...props}
        />
    )
}

function AvatarGroupCount({ className, ...props }: AvatarGroupCountProps) {
    return (
        <div
            data-slot="avatar-group-count"
            className={cn(avatarGroupCountVariants(), className)}
            {...props}
        />
    )
}

export {
    Avatar,
    AvatarImage,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarBadge,
}
