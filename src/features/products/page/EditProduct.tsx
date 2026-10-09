"use client";

import { notFound } from "next/navigation";
import * as React from "react";

import { formatMessage, messages } from "@/messages";

import { ProductFormLayout } from "../components/form";
import { useProductDetail } from "../hooks/use-product-detail";
import { useUpdateProduct } from "../hooks/use-update-product";
import type { ProductApiResponse } from "../interfaces";
import { toProductFormValues } from "../mappers";


interface EditProductProps {
    productId: string;
}


/**
 * Pantalla de edición de producto
 *
 * Es el mismo asistente del alta, arrancado con el producto cargado. La ruta
 * ya revisó en el servidor que el producto existe; el `notFound` de aquí cubre
 * el caso de que deje de existir mientras la pantalla está abierta.
 */
export default function EditProduct({ productId }: EditProductProps) {
    const product = useProductDetail(productId);

    if (!product) notFound();

    return <EditProductForm product={product} />;
};


function EditProductForm({ product }: { product: ProductApiResponse }) {
    // Se congela con el producto tal como llegó. Si la caché se refresca
    // mientras se edita, el formulario no cambia, y lo que se envía tiene que
    // seguir comparándose contra lo mismo que vio la persona al abrirlo.
    const [initialValues] = React.useState(() => toProductFormValues(product));

    const updateProduct = useUpdateProduct(product.id, initialValues);

    return (
        <ProductFormLayout
            formMessages={{
                ...messages.products.edit,
                subtitle: formatMessage(messages.products.edit.subtitle, {
                    name: product.name,
                }),
            }}
            defaultValues={initialValues}
            onSave={updateProduct.mutate}
            isSaving={updateProduct.isPending}
            requireChanges
            currentCategory={{
                value: product.categoryId,
                label: product.categoryName ?? "",
            }}
        />
    );
}
