"use client";

import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

interface OrderSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function OrderSearch({
    value,
    onChange,
}: OrderSearchProps) {
    return (
        <div className="relative w-full">

            <Search
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-neutral-400"
            />

            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Buscar por mesa, orden o mesero..."
                className="pl-10"
            />

        </div>
    );
}