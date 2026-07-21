import MetricCard from "@/components/cards/MetricCard";
import { ChartNoAxesCombined, DollarSign, ShoppingBag, Users } from "lucide-react";

export default function Dashboard() {
    return (
        <>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                    icon={DollarSign}
                    color="secondary"
                    label="Ventas totales"
                    value="182.940"
                    delta={12.5}
                />
                <MetricCard
                    icon={Users}
                    color="info"
                    label="Total de usuarios"
                    value={18765}
                    delta={2.6}
                />
                <MetricCard
                    icon={ShoppingBag}
                    color="warning"
                    label="Total de órdenes"
                    value={4876}
                    delta={-3.2}
                />
                <MetricCard
                    icon={ChartNoAxesCombined}
                    color="success"
                    label="Margen de ganancia"
                    value="38.6%"
                    delta={1.8}
                />
            </section>
        </>
    );
};