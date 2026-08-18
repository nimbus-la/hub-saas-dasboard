import React from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { notify } from "@/components";
import { useHttpClient } from "@/context";
import { getApiErrorMessage } from "@/lib/http";
import { CategoriesService } from "../interfaces";
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
    }
};