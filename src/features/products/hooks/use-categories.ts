import React from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/components";
import { useHttpClient } from "@/context";
import { getApiErrorMessage } from "@/lib/http";
import { CategoriesService, CreateCategoryParams, UpdateCategoryParams } from "../interfaces";
import { createCategoriesService } from "../services";


const categoryKeys = {
    all: ["products_categories"] as const,
    list: () => [...categoryKeys.all, "products_categories_list"] as const,
    detail: (id: string) => [...categoryKeys.all, "products_categories_detail", id] as const,
};


export function useProductsCategories() {
    const http = useHttpClient();
    const queryClient = useQueryClient();


    const service = React.useMemo<CategoriesService>(
        () => createCategoriesService(http),
        [http]
    );


    const query = useQuery({
        queryKey: categoryKeys.list(),
        queryFn: ({ signal }: { signal: AbortSignal }) => service.list({ signal })
    });


    const createCategory = useMutation({
        mutationFn: (params: CreateCategoryParams) => service.create(params),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.list() })
    });


    const updateCategory = useMutation({
        mutationFn: ({ id, params }: { id: string, params: UpdateCategoryParams }) =>
            service.update(id, params),

        onSuccess: () => {
            // TODO: Implementar alerta de exito.
            return queryClient.invalidateQueries({ queryKey: categoryKeys.list() });
        }
    })


    React.useEffect(() => {
        if (query.isError) {
            const errorMessage = getApiErrorMessage(query.error);
            notify.error(errorMessage)
        }
    }, [query.isError])


    return {
        data: query.data,
        error: query.error,
        isLoading: query.isLoading,
        isPending: query.isPending,
        isError: query.isError,

        create: createCategory,
        update: updateCategory
    }
};