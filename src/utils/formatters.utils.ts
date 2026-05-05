import { ICON_TOKENS, IconToken } from "@/tokens";
import { LucideIcon } from "lucide-react";

export function getMenuIcon(icon: IconToken): LucideIcon {
    return ICON_TOKENS[icon];
}