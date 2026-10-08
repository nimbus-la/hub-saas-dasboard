"use client";

import { useMutation } from "@tanstack/react-query";

import { useHttpClient } from "@/context";
import { createSessionManager } from "@/lib/auth/session-manager";
import { messages } from "@/messages";


export function useLogout() {
    const http = useHttpClient();

    const { closeSession } = createSessionManager(http);

    return useMutation({
        mutationFn: closeSession,
        meta: { loadingMessage: messages.auth.logout.loading },
    });
}