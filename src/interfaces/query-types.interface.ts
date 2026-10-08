import { NotifyOptions } from "@/interfaces/components";

export type QueryAlertPolicy = {
    alertOnError?: boolean;
    alertOptions?: NotifyOptions;
}


export type MutationAlertPolicy = QueryAlertPolicy & {
    alertOnSuccess?: boolean;
}


/**
 * Cómo se ve una mutación en el loader global (`GlobalLoader`).
 *
 * Por defecto toda mutación lo enciende, porque es lo que evita dibujar un
 * "cargando" en cada botón. Se apaga solo cuando la pantalla ya enseña su
 * propia espera.
 */
export type MutationLoadingPolicy = {
    globalLoading?: boolean;

    /** Lo que está pasando, en gerundio: "Eliminando producto…". */
    loadingMessage?: string;
}


declare module "@tanstack/react-query" {
    interface Register {
        queryMeta: QueryAlertPolicy;
        mutationMeta: MutationAlertPolicy & MutationLoadingPolicy;
    }
}
