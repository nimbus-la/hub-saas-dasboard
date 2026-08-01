import { cn } from "@/lib/utils";
import { StatusBadgeProps } from "@/interfaces";
import { statusBadgeVariants } from "./status-badge.style";


export default function StatusBadge({ label, tone, className }: StatusBadgeProps) {
    return (
        <span className={cn(statusBadgeVariants({ tone }), className)}>
            {label}
        </span>
    );
};
