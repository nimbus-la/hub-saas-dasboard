import { NotifyOptions } from "@/interfaces/components";

export type QueryAlertPolicy = {
    alertOnError?: boolean;
    alertOptions?: NotifyOptions;
}


export type MutationAlertPolicy = QueryAlertPolicy & {
    alertOnSuccess?: boolean;
}


declare module "@tanstack/react-query" {
    interface Register {
        queryMeta: QueryAlertPolicy;
        mutationMeta: MutationAlertPolicy;
    }
}