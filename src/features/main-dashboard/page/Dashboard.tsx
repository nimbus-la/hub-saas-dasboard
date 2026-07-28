import { ChartNoAxesCombined, DollarSign, ShoppingBag, Users } from "lucide-react";

import MetricCard from "@/components/cards/MetricCard";
import { getTopProducts } from "@/lib/top-products";
import SalesChartSection from "../components/charts/SalesChartSection";
import TopProductsTable from "../components/tables/TopProductsTable";

export default function Dashboard() {
    return (
        <>
            <div className="flex flex-col gap-6">
                <section className="grid grid-cols-[repeat(auto-fit,minmax(min(15rem,100%),1fr))] gap-6">
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

                <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <SalesChartSection className="lg:col-span-2" />
                    <TopProductsTable className="lg:col-span-1" products={getTopProducts()} />
                </section>
            </div>
        </>
    );
};