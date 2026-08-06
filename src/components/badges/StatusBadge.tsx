import { cn } from "@/lib/utils";
import { StatusBadgeProps } from "@/interfaces";
import { statusBadgeVariants } from "./status-badge.style";


/**
 * StatusBadge
 *
 * Etiqueta de estado. No es pulsable ni recibe foco: solo dice en qué punto
 * está algo. El tamaño por defecto es `sm` —el de `COMPONENT_DEFAULT_SIZE`—
 * porque acompaña a controles `md` y tiene que quedar por debajo de ellos.
 */
export default function StatusBadge({ label, tone, size, className }: StatusBadgeProps) {
    return (
        <span className={cn(statusBadgeVariants({ tone, size }), className)}>
            {label}
        </span>
    );
};
