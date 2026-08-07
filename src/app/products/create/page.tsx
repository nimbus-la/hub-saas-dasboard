import type { Metadata } from "next";

import CreateProduct from "@/features/products/page/CreateProduct";

export const metadata: Metadata = {
    title: "Nuevo producto · Vorea",
    description: "Añade un producto a la carta de tus sucursales.",
};

export default function CreateProductPage() {
    // La ruta no resuelve datos: el alta parte de un borrador vacío y las
    // categorías son una constante del dominio. Cuando el formulario haya que
    // precargarlo —duplicar un producto, retomar un borrador— es aquí donde
    // entra el servicio, igual que `getProducts` en la lista.
    return (<CreateProduct />);
};
