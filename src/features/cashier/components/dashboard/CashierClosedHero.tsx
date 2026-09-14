"use client";

import { Lock, Store } from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";

interface CashierClosedHeroProps {
    onOpenCash: () => void;
}

export default function CashierClosedHero({
    onOpenCash,
}: CashierClosedHeroProps) {
    return (
        <section className="rounded-2xl border border-orange-200 bg-orange-50">

            <div className="grid grid-cols-3">

                <div className="flex items-center justify-center p-10">

                    <div className="flex h-52 w-52 items-center justify-center rounded-full border-2 border-orange-200">

                        <Lock
                            size={90}
                            className="text-orange-500"
                        />

                    </div>

                </div>

                <div className="flex flex-col justify-center gap-5 py-10">

                    <h2 className="text-4xl font-bold">
                        Caja cerrada
                    </h2>

                    <p className="text-lg text-neutral-600">
                        Debes abrir la caja para comenzar tu turno y poder procesar pagos.
                    </p>

                    <div>

                        <GenericButton
                            label="Abrir Caja"
                            onClick={onOpenCash}
                        />

                    </div>

                </div>

                <div className="flex items-center gap-8 p-10">

                    <div className="h-52 w-px bg-neutral-200" />

                    <div>

                        <h3 className="mb-5 text-xl font-semibold">
                            ¿Cómo abrir la caja?
                        </h3>

                        <div className="space-y-4">

                            <Step
                                number={1}
                                text="Ingresa el monto inicial."
                            />

                            <Step
                                number={2}
                                text="Confirma la apertura."
                            />

                            <Step
                                number={3}
                                text="Empieza a cobrar órdenes."
                            />

                        </div>

                    </div>

                    <Store
                        size={110}
                        className="text-orange-200"
                    />

                </div>

            </div>

        </section>
    );
}

function Step({
    number,
    text,
}: {
    number: number;
    text: string;
}) {
    return (
        <div className="flex gap-3">

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600 text-sm font-bold text-white">
                {number}
            </div>

            <p className="text-neutral-600">
                {text}
            </p>

        </div>
    );
}