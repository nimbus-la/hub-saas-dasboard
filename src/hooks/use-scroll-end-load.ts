"use client";

/**
 * Carga al llegar al final de un contenedor con scroll
 *
 * Pide la siguiente tanda de una lista con scroll propio —un carril
 * horizontal de pestañas, el panel de un selector— siguiendo dos reglas:
 *
 * - Si el contenedor desborda, solo cuando el usuario lo ha desplazado y el
 *   final queda a menos de `threshold` píxeles. Nada se pide por el simple
 *   hecho de abrir la pantalla o el panel.
 * - Si todo cabe, se pide sin esperar: no hay nada que desplazar, y sin esa
 *   carga el resto de elementos sería inalcanzable. Se repite tanda a tanda
 *   hasta que el contenedor desborde.
 *
 *     const [list, setList] = React.useState<HTMLDivElement | null>(null);
 *
 *     useScrollEndLoad({
 *         scroller: list,
 *         axis: "y",
 *         enabled: query.hasNextPage && query.fetchStatus === "idle",
 *         onLoadMore: query.fetchNextPage,
 *     });
 *
 *     <div ref={setList} className="overflow-y-auto">…</div>
 *
 * Recibe el nodo y no crea su propia ref porque hay contenedores que se montan
 * y desmontan solos (el panel de un selector): con el nodo en estado, el
 * efecto se vuelve a conectar cada vez que aparece.
 *
 * No usa `IntersectionObserver` como `useInfiniteScroll`: avisa en cuanto el
 * final entra en el margen, haya desplazado el usuario o no. Aquí manda el
 * evento `scroll`, más un `ResizeObserver` para cuando el contenedor crece o
 * llegan elementos nuevos y deja de desbordar.
 *
 * `enabled` tiene que apagarse mientras llega una tanda, igual que en
 * `useInfiniteScroll`; al volver a encenderse se revisa el contenedor otra vez.
 */

import * as React from "react";


/**
 * Cuánto antes del final se empieza a pedir. 200px son unas dos pestañas o
 * cinco opciones de un selector: lo que se recorre de un golpe de rueda.
 */
export const SCROLL_END_LOAD_THRESHOLD = 200;


interface UseScrollEndLoadOptions {
    /** El contenedor con scroll. Su primer hijo es la lista que crece. */
    scroller: HTMLElement | null;
    /** Eje en el que desplaza: `x` para carriles, `y` para listas. */
    axis: "x" | "y";
    /** Si se puede pedir más ahora mismo: hay tandas y no hay una en camino. */
    enabled: boolean;
    onLoadMore: () => unknown;
    threshold?: number;
}


export function useScrollEndLoad({
    scroller,
    axis,
    enabled,
    onLoadMore,
    threshold = SCROLL_END_LOAD_THRESHOLD,
}: UseScrollEndLoadOptions) {
    // Un ref y no estado: solo lo leen los listeners, y guardarlo en estado
    // repintaría la lista en el primer scroll sin que cambie nada visible.
    const hasScrolledRef = React.useRef(false);

    // Fuera de las dependencias de los efectos, igual que en `useInfiniteScroll`:
    // lee siempre el `enabled` y el `onLoadMore` del último render sin tener que
    // volver a conectar los observadores.
    const checkLoadMore = React.useEffectEvent(() => {
        if (!enabled || !scroller) return;

        const overflow =
            axis === "x"
                ? scroller.scrollWidth - scroller.clientWidth
                : scroller.scrollHeight - scroller.clientHeight;

        // Un píxel de tolerancia: con zoom o medidas fraccionarias, una lista
        // que cabe puede medir medio píxel más que su contenedor.
        if (overflow <= 1) {
            void onLoadMore();
            return;
        }

        const scrolled = axis === "x" ? scroller.scrollLeft : scroller.scrollTop;

        if (hasScrolledRef.current && overflow - scrolled <= threshold) {
            void onLoadMore();
        }
    });

    React.useEffect(() => {
        if (!scroller) return undefined;

        // Un contenedor recién montado todavía no ha sido desplazado.
        hasScrolledRef.current = false;

        // Cuenta cualquier desplazamiento: rueda, trackpad, dedo, barra o el
        // `scrollIntoView` de las flechas del teclado. Todos los provoca el usuario.
        const handleScroll = () => {
            hasScrolledRef.current = true;
            checkLoadMore();
        };

        // Se observan el contenedor (la ventana cambia de tamaño) y la lista
        // (llegan elementos nuevos). También avisa al conectarse, que cubre la
        // primera revisión al montar.
        const resizeObserver = new ResizeObserver(() => checkLoadMore());

        resizeObserver.observe(scroller);
        if (scroller.firstElementChild) resizeObserver.observe(scroller.firstElementChild);

        scroller.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            resizeObserver.disconnect();
            scroller.removeEventListener("scroll", handleScroll);
        };
    }, [scroller]);

    // Al terminar una tanda: si sigue sin desbordar, o el usuario sigue al
    // final, se pide la siguiente.
    React.useEffect(() => {
        if (enabled) checkLoadMore();
    }, [enabled]);
}
