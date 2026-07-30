import { statusBadgeVariants } from "@/components/badges/status-badge.style";
import { VariantProps } from "class-variance-authority";

/** Tonos disponibles — se deriva de las variantes para no duplicar la lista. */
export type BadgeTone = NonNullable<VariantProps<typeof statusBadgeVariants>["tone"]>;


export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
    label: string;
    className?: string;
};