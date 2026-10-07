"use client";

import { useMutation } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { createSessionManager } from "@/lib/auth/session-manager";


export function useLogout() {
    const http = useHttpClient();

    const { closeSession } = createSessionManager(http);

    return useMutation({ mutationFn: closeSession })
}