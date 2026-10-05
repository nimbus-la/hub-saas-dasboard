"use client";

/**
 * Scroll infinito
 *
 * Devuelve una ref para un elemento centinela que se coloca al final de la
 * lista. Cuando el centinela entra en pantalla se pide la siguiente tanda.
 *
 *     const sentinelRef = useInfiniteScroll<HTMLDivElement>({
 *         enabled: query.hasNextPage && query.fetchStatus === "idle",
 *         onLoadMore: query.fetchNextPage,
 *     });
 *
 *     <div ref={sentinelRef} aria-hidden="true" />
 *
 * Se usa `IntersectionObserver` y no el evento `scroll` porque el navegador
 * avisa solo cuando cambia la visibilidad, sin medir en cada fotograma.
 *
 * `enabled` tiene que apagarse mientras llega una página. No es solo para no
 * pedirla dos veces: el observador únicamente avisa cuando el centinela *cambia*
 * de visibilidad, y en una pantalla alta puede seguir visible después de pintar
 * la tanda nueva. Al volver a encenderse se crea un observador nuevo, y ese sí
 * informa del estado actual en su primera llamada, así que la carga continúa
 * hasta llenar la pantalla sin que el usuario tenga que moverse.
 */

import * as React from "react";


/**
 * Cuánto antes del final se empieza a pedir.
 *
 * Unos 400px es algo menos de media pantalla de portátil: da tiempo a que la
 * respuesta llegue antes de que el usuario toque fondo sin adelantar páginas
 * que quizá no llegue a ver.
 */
export const INFINITE_SCROLL_ROOT_MARGIN = "0px 0px 400px 0px";


interface UseInfiniteScrollOptions {
    /** Si se puede pedir más ahora mismo: hay páginas y no hay una en camino. */
    enabled: boolean;
    onLoadMore: () => unknown;
    rootMargin?: string;
}


export function useInfiniteScroll<TElement extends Element>({
    enabled,
    onLoadMore,
    rootMargin = INFINITE_SCROLL_ROOT_MARGIN,
}: UseInfiniteScrollOptions) {
    const sentinelRef = React.useRef<TElement>(null);

    // Fuera de las dependencias del efecto: una función nueva en cada render no
    // debe desconectar y reconectar el observador.
    const loadMore = React.useEffectEvent(() => {
        void onLoadMore();
    });

    React.useEffect(() => {
        const sentinel = sentinelRef.current;

        if (!enabled || !sentinel) return undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) loadMore();
            },
            { rootMargin }
        );

        observer.observe(sentinel);

        return () => observer.disconnect();
    }, [enabled, rootMargin]);

    return sentinelRef;
}
