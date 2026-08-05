import GenericButton from "@/components/buttons/GenericButton";
import { LockIcon } from "lucide-react";

interface CashierStatusProps {
    isOpen: boolean;
    onOpenCash?: () => void;
}

export default function CashierStatus({
    isOpen,
    onOpenCash,
}: CashierStatusProps) {
    if (isOpen) return null;

    return (
        <section className="flex flex-col gap-6 rounded-xl border border-error-light bg-error-lighter p-6 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-error-light text-error-main">
                    <LockIcon size={24} />
                </div>

                <div className="space-y-1">
                    <h2 className="text-lg font-semibold text-neutral-900">
                        Caja cerrada
                    </h2>

                    <p className="text-sm text-neutral-500">
                        Debes abrir la caja para comenzar el turno y procesar pagos.
                    </p>
                </div>

            </div>

            <GenericButton
                label="Abrir caja"
                onClick={onOpenCash}
            />

        </section>
    );
}