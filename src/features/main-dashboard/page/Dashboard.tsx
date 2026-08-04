import { ChartNoAxesCombined, DollarSign, ShoppingBag, Users } from "lucide-react";

import MetricCard from "@/components/cards/MetricCard";
import { formatCurrencyCompact } from "@/lib/format";
import { getRecentOrders } from "@/lib/recent-orders";
import { getTopProducts } from "@/lib/top-products";
import { RecentOrdersTable, SalesChartSection, TopProductsCard } from "../components";

export default function Dashboard() {
    const { products: topProducts, totalUnits: topProductsUnits } = getTopProducts();

    return (
        <>
            <div className="flex flex-col gap-6">
                <section className="grid grid-cols-[repeat(auto-fit,minmax(min(15rem,100%),1fr))] gap-6">
                    <MetricCard
                        icon={DollarSign}
                        color="secondary"
                        label="Ventas totales"
                        // Abreviado: el importe completo en COP no cabe en la
                        // tarjeta sin partirse en dos líneas.
                        value={formatCurrencyCompact(682_940_000)}
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
                    
                    <TopProductsCard
                        className="lg:col-span-1"
                        products={topProducts}
                        totalUnits={topProductsUnits}
                    />
                </section>

                <section>
                    <RecentOrdersTable orders={getRecentOrders()} />
                </section>
            </div>
        </>
    );
};