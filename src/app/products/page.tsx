import type { Metadata } from "next";

import Products from "@/features/products/page/Products";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
    title: "Productos · Vorea",
    description: "Catálogo de productos de tus sucursales.",
};

export default function ProductsPage() {
    // El catálogo se resuelve en el servidor y baja ya listo a la pantalla,
    // que solo se ocupa de filtrarlo y paginarlo.
    return (<Products products={getProducts()} />);
};
