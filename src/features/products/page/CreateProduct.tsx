"use client";

import { messages } from "@/messages";

import { ProductFormLayout } from "../components/form";
import { useCreateProduct } from "../hooks/use-create-product";
import { DEFAULT_PRODUCT_FORM_VALUES } from "../libs";


/**
 * Pantalla de alta de producto
 *
 * El asistente arranca vacío y al guardar crea el producto. Todo lo demás lo
 * comparte con la edición dentro de `ProductFormLayout`.
 */
export default function CreateProduct() {
    const createProduct = useCreateProduct();

    return (
        <ProductFormLayout
            formMessages={messages.products.create}
            defaultValues={DEFAULT_PRODUCT_FORM_VALUES}
            onSave={createProduct.mutate}
            isSaving={createProduct.isPending}
        />
    );
};
