import { statusBadgeVariants } from "@/components";
import { VariantProps } from "class-variance-authority";

/** Tonos disponibles — se deriva de las variantes para no duplicar la lista. */
export type BadgeTone = NonNullable<VariantProps<typeof statusBadgeVariants>["tone"]>;


/**
 * Escalón con el que se pinta la insignia.
 *
 * Los seis de la escala: la insignia es decorativa, así que los admite todos.
 * Las medidas salen de `BADGE_SIZE` — h-5 · h-6 · h-7 · h-8 · h-9 · h-10.
 */
export type BadgeSize = NonNullable<VariantProps<typeof statusBadgeVariants>["size"]>;


export interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
    label: string;
    className?: string;
};
