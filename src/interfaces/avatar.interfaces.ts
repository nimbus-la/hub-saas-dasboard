import type * as React from "react";
import type { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";

import type { SizeToken } from "@/tokens";

/**
 * Escala del avatar: los seis escalones del sistema.
 *
 * Los lados salen de `AVATAR_SIZE` — 24 · 32 · 40 · 48 · 64 · 80 px.
 */
export type AvatarSize = SizeToken;


export interface AvatarProps extends AvatarPrimitive.Root.Props {
    /** Lado del avatar y, con él, el tamaño de las iniciales y del punto. */
    size?: AvatarSize;
};


export type AvatarImageProps = AvatarPrimitive.Image.Props;

export type AvatarFallbackProps = AvatarPrimitive.Fallback.Props;

/** Punto de estado sobre la esquina del avatar. */
export type AvatarBadgeProps = React.ComponentProps<"span">;

export type AvatarGroupProps = React.ComponentProps<"div">;

export type AvatarGroupCountProps = React.ComponentProps<"div">;
