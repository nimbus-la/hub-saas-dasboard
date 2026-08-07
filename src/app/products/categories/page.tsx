import type { Metadata } from "next";

import Categories from "@/features/products/page/Categories";
import { getCategories } from "@/lib/categories";

export const metadata: Metadata = {
    title: "Categorías · Vorea",
    description: "Secciones en las que se agrupa la carta de tus sucursales.",
};

export default function CategoriesPage() {
    // Las categorías se resuelven en el servidor y bajan ya listas a la
    // pantalla, que solo se ocupa de filtrarlas y editarlas.
    return (<Categories categories={getCategories()} />);
};
