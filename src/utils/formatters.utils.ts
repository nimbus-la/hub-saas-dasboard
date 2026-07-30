import { ICON_TOKENS, IconToken } from "@/tokens";
import { LucideIcon } from "lucide-react";

export function getMenuIcon(icon: IconToken): LucideIcon {
    return ICON_TOKENS[icon];
}

/**
 * Iniciales de un nombre completo, para avatares sin foto.
 * Ej.: "Darlene Robertson" → "DR"
 */
export function getInitials(fullName: string, maxInitials = 2): string {
    return fullName
        .trim()
        .split(/\s+/)
        .slice(0, maxInitials)
        .map((namePart) => namePart.charAt(0).toUpperCase())
        .join("");
}