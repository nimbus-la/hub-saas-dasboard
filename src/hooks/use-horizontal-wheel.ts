"use client";

/**
 * Rueda vertical en un carril horizontal
 *
 * Recibe un contenedor con `overflow-x` y hace que la rueda de un ratón —que
 * solo sabe girar en vertical— desplace el carril hacia los lados. Trackpads y pantallas táctiles ya mueven en horizontal por su cuenta
 * y no se tocan.
 *
 *     const [scroller, setScroller] = React.useState<HTMLDivElement | null>(null);
 *
 *     useHorizontalWheel(scroller);
 *
 *     <div ref={setScroller} className="overflow-x-auto">…</div>
 *
 * El listener se registra a mano y no con `onWheel` porque React lo añade como
 * pasivo, y sin `preventDefault` la página se desplazaría a la vez que el carril.
 */

import * as React from "react";


/** Píxeles de una "línea" de rueda cuando el navegador no los da en píxeles (Firefox). */
const WHEEL_LINE_HEIGHT = 16;


export function useHorizontalWheel(scroller: HTMLElement | null) {
    React.useEffect(() => {
        if (!scroller) return undefined;

        const handleWheel = (event: WheelEvent) => {
            // Un gesto ya horizontal es de trackpad y el navegador lo resuelve
            // solo; con Ctrl la rueda es zoom.
            if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;

            const delta =
                event.deltaMode === WheelEvent.DOM_DELTA_LINE
                    ? event.deltaY * WHEEL_LINE_HEIGHT
                    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
                      ? event.deltaY * scroller.clientWidth
                      : event.deltaY;

            const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
            const canMove = delta < 0 ? scroller.scrollLeft > 0 : scroller.scrollLeft < maxScrollLeft - 1;

            // En los extremos, o si todo cabe, la rueda vuelve a ser de la
            // página: el carril no debe atrapar a quien solo quería bajar.
            if (!canMove) return;

            event.preventDefault();
            scroller.scrollLeft += delta;
        };

        scroller.addEventListener("wheel", handleWheel, { passive: false });

        return () => scroller.removeEventListener("wheel", handleWheel);
    }, [scroller]);
}
