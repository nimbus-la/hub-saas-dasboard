import { MetricCard } from "@/components";
import { ChartNoAxesCombined, DollarSign, ShoppingBag, Users } from "lucide-react";

export default function Inventory() {
    return(
    <div className="flex flex-col gap-6">
                    <section className="grid grid-cols-[repeat(auto-fit,minmax(min(15rem,100%),1fr))] gap-6">
                        <MetricCard
                            icon={DollarSign}
                            color="secondary"
                            label="Árticulos Totales"
                            // Abreviado: el importe completo en COP no cabe en la
                            // tarjeta sin partirse en dos líneas.
                            value={'34'}
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
                    </section></div>
)
;}