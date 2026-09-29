"use client";

/**
 * Scroll infinito en un carril horizontal
 *
 * Pide la siguiente tanda de un carril con `overflow-x` siguiendo dos reglas:
 *
 * - Si el carril desborda, solo cuando el usuario lo ha desplazado y el final
 *   queda a menos de `threshold` píxeles. Nada se pide por el simple hecho de
 *   abrir la pantalla.
 * - Si todo cabe, se pide sin esperar: no hay nada que desplazar, y sin esa
 *   carga el resto de elementos sería inalcanzable. Se repite tanda a tanda
 *   hasta que el carril desborde.
 *
 *     const scrollerRef = React.useRef<HTMLDivElement>(null);
 *
 *     useHorizontalInfiniteScroll({
 *         scrollerRef,
 *         enabled: query.hasNextPage && query.fetchStatus === "idle",
 *         onLoadMore: query.fetchNextPage,
 *     });
 *
 * No usa `IntersectionObserver` como `useInfiniteScroll`: avisa en cuanto el
 * final entra en el margen, haya desplazado el usuario o no. Aquí manda el
 * evento `scroll`, más un `ResizeObserver` para cuando la ventana crece o
 * llegan elementos nuevos y el carril deja de desbordar.
 *
 * `enabled` tiene que apagarse mientras llega una tanda, igual que en
 * `useInfiniteScroll`; al volver a encenderse se revisa el carril otra vez.
 */

import * as React from "react";


/**
 * Cuánto antes del final se empieza a pedir. 200px son unas dos pestañas, lo
 * que se recorre de un golpe de rueda.
 */
export const HORIZONTAL_INFINITE_SCROLL_THRESHOLD = 200;


interface UseHorizontalInfiniteScrollOptions {
    /** El contenedor con `overflow-x`. Su primer hijo es la lista que crece. */
    scrollerRef: React.RefObject<HTMLElement | null>;
    /** Si se puede pedir más ahora mismo: hay tandas y no hay una en camino. */
    enabled: boolean;
    onLoadMore: () => unknown;
    threshold?: number;
}


export function useHorizontalInfiniteScroll({
    scrollerRef,
    enabled,
    onLoadMore,
    threshold = HORIZONTAL_INFINITE_SCROLL_THRESHOLD,
}: UseHorizontalInfiniteScrollOptions) {
    // Un ref y no estado: solo lo leen los listeners, y guardarlo en estado
    // repintaría el carril en el primer scroll sin que cambie nada visible.
    const hasScrolledRef = React.useRef(false);

    // Fuera de las dependencias de los efectos, igual que en `useInfiniteScroll`:
    // lee siempre el `enabled` y el `onLoadMore` del último render sin tener que
    // volver a conectar los observadores.
    const checkLoadMore = React.useEffectEvent(() => {
        const scroller = scrollerRef.current;

        if (!enabled || !scroller) return;

        const overflow = scroller.scrollWidth - scroller.clientWidth;

        // Un píxel de tolerancia: con zoom o anchos fraccionarios, un carril
        // que cabe puede medir medio píxel más que su contenedor.
        if (overflow <= 1) {
            void onLoadMore();
            return;
        }

        if (hasScrolledRef.current && overflow - scroller.scrollLeft <= threshold) {
            void onLoadMore();
        }
    });

    React.useEffect(() => {
        const scroller = scrollerRef.current;

        if (!scroller) return undefined;

        // Cuenta cualquier desplazamiento: rueda, trackpad, dedo, barra o el
        // `scrollIntoView` de las flechas del teclado. Todos los provoca el usuario.
        const handleScroll = () => {
            hasScrolledRef.current = true;
            checkLoadMore();
        };

        // Se observan el carril (la ventana cambia de ancho) y la lista (llegan
        // pestañas nuevas). También avisa al conectarse, que cubre la primera
        // revisión al montar.
        const resizeObserver = new ResizeObserver(() => checkLoadMore());

        resizeObserver.observe(scroller);
        if (scroller.firstElementChild) resizeObserver.observe(scroller.firstElementChild);

        scroller.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            resizeObserver.disconnect();
            scroller.removeEventListener("scroll", handleScroll);
        };
    }, [scrollerRef]);

    // Al terminar una tanda: si sigue sin desbordar, o el usuario sigue al
    // final, se pide la siguiente.
    React.useEffect(() => {
        if (enabled) checkLoadMore();
    }, [enabled]);
}
