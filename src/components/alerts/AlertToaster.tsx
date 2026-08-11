"use client";

import type { CSSProperties } from "react";

import { Toaster, toast } from "sonner";

import type { AlertToasterProps, AlertTone, NotifyOptions } from "@/interfaces";
import { SPACING } from "@/tokens";
import { ALERT_DURATION } from "@/utils";

import Alert from "./Alert";


/**
 * Ancho de la pila de avisos.
 *
 * Los 356px que trae sonner están pensados para su aviso —una línea de texto de
 * 13px con un icono de 16—, y a este no le llegan: entre el medallón de 40, los
 * dos huecos de 16, el relleno de 16 y la equis, la columna de texto se queda
 * en unos 230px y el título parte en dos líneas casi siempre. Con 400 la
 * columna sube a ~270 y un título normal entra de una. Por encima el aviso
 * empieza a tapar contenido en portátiles de 1280.
 *
 * Va aquí y no en `@/tokens` porque no es una medida del sistema: es cuánto
 * ocupa esta pila, y sólo la lee sonner a través de su variable CSS.
 */
const TOASTER_WIDTH = "400px";


/**
 * AlertToaster
 *
 * La pila de avisos flotantes: el `Toaster` de sonner configurado para que cada
 * aviso se pinte con `Alert`, que es el que sabe qué aspecto tiene un aviso en
 * este panel.
 *
 * El reparto es el de siempre: **sonner pone el comportamiento y `Alert` el
 * dibujo.** De sonner viene lo que cuesta caro y se hace mal —la cola, el
 * apilado, el temporizador que se para al pasar el ratón y sigue por donde
 * iba, el descarte deslizando, la región `aria-live` que lo lee, el foco que
 * vuelve a su sitio al cerrar—. De `Alert`, el medallón de tono, la tipografía
 * y la barra de cuenta atrás.
 *
 * Los avisos se pintan con `toast.custom`, así que sonner no envuelve nada en
 * su tarjeta: el `<li>` se queda sin estilo propio y lo único que se ve es el
 * `Alert` en variante `outline`. Por eso no hay aquí ni un color ni un radio —
 * cambiarlos se hace en `alert.style.ts`, y el aviso de dentro de una pantalla
 * cambia con él—.
 *
 * Éste **es** el envoltorio de sonner del proyecto, así que el `Toaster` viene
 * del paquete y no de un `components/ui/sonner`. El que instala shadcn no pinta
 * nada aquí: sus iconos por tipo, sus variables de color y su lectura del tema
 * describen la tarjeta que sonner monta por su cuenta, y todo eso muere en el
 * momento en que el aviso lo dibuja `Alert`. Volver a añadirlo sólo mete otro
 * archivo por el que pasar sin que cambie un píxel.
 *
 * Se monta una sola vez, en el layout raíz. Desde cualquier sitio del árbol
 * —incluida una función suelta— se le habla con `notify`.
 */
export default function AlertToaster({
    position = "top-right",
    expand = false,
    visibleToasts = 3,
    offset = SPACING.xl,
    className = "",
}: AlertToasterProps = {}) {
    return (
        <Toaster
            position={position}
            /*
             * Sin desplegar por defecto: los avisos se apilan uno sobre otro y
             * se abren en abanico al pasar el ratón. Es lo que mantiene la
             * esquina despejada cuando llegan tres seguidos.
             *
             * Y es además la condición que enciende la pausa: sonner marca los
             * avisos con `data-expanded` mientras el puntero está encima, que
             * es de donde la barra de cuenta atrás saca su congelación. Con
             * `expand` a `true` ese atributo estaría puesto siempre y las
             * barras no avanzarían nunca.
             */
            expand={expand}
            visibleToasts={visibleToasts}
            offset={offset}
            // La separación entre avisos apilados, del mismo escalón que el
            // resto del panel en lugar de los 14px sueltos de sonner.
            gap={SPACING.md}
            className={className}
            toastOptions={{
                classNames: {
                    toast: [
                        // El `<li>` de sonner sólo trae ancho cuando pinta su
                        // propia tarjeta. Como aquí no la pinta, el ancho lo
                        // pone esta clase: sin ella cada aviso se encoge hasta
                        // su texto y la pila queda en escalera.
                        "w-full",

                        /*
                         * Los avisos de detrás, mientras la pila está plegada.
                         *
                         * Sonner los recorta al alto del de delante y esconde
                         * su contenido, pero lo segundo sólo se lo aplica a sus
                         * propias tarjetas (`[data-styled=true]`), y las
                         * nuestras no lo son. Sin estas dos reglas, un aviso
                         * más alto que el de encima asoma por debajo y se lee
                         * el final de una frase suelta bajo la pila.
                         *
                         * Van sobre el `<li>` y no en `alert.style.ts` porque
                         * describen cómo se comporta un aviso dentro de esta
                         * pila —no cómo es un aviso—, y el de dentro de una
                         * pantalla no sabe nada de esto.
                         */
                        "[&[data-expanded=false][data-front=false]]:overflow-hidden",
                        "[&[data-expanded=false][data-front=false]>*]:opacity-0",
                    ].join(" "),
                },
            }}
            style={{ "--width": TOASTER_WIDTH } as CSSProperties}
        />
    );
};


/**
 * Lanza un aviso flotante de un tono.
 *
 * La duración se usa dos veces a propósito: la cuenta la lleva sonner y la
 * barra sólo la dibuja, así que el único modo de que no se contradigan es que
 * salgan del mismo número. Por eso `Alert` no recibe aquí una barra propia,
 * sino el mismo valor que el temporizador.
 *
 * `announce` va a `false` porque la pila entera ya es una región `aria-live`:
 * un `role="alert"` dentro de ella haría que el lector de pantalla leyera el
 * mismo aviso dos veces.
 */
const notifyWithTone =
    (tone: AlertTone) =>
        (title: string, options: NotifyOptions = {}) => {
            const { duration = ALERT_DURATION, id, onClose, ...alert } = options;

            return toast.custom(
                (toastId) => (
                    <Alert
                        {...alert}
                        tone={tone}
                        variant="outline"
                        title={title}
                        countdownMs={duration}
                        announce={false}
                        // La equis no cierra la caja: se lo pide a sonner, que
                        // es quien la montó. Así el aviso sale con la misma
                        // animación tanto si lo cierra el usuario como si se le
                        // acaba el tiempo, y el hueco que deja lo recuperan los
                        // de abajo.
                        onClose={() => toast.dismiss(toastId)}
                    />
                ),
                {
                    // El identificador sólo se manda si lo hay: con
                    // `exactOptionalPropertyTypes`, un `id: undefined` no es lo
                    // mismo que no pasar `id`, y sonner necesita lo segundo
                    // para generar el suyo.
                    ...(id !== undefined && { id }),
                    // `null` es un aviso que no caduca —un error del que hay que
                    // hacerse cargo—. Sonner lo escribe como `Infinity`.
                    duration: duration ?? Infinity,
                    // Se avisa por los dos caminos porque para quien lo mostró
                    // son el mismo hecho: el aviso ya no está. Van envueltos en
                    // una función y no pasados a pelo porque sonner llama a sus
                    // manejadores con el aviso entero, y eso no es asunto de
                    // quien sólo quiere enterarse de que se fue.
                    onDismiss: () => onClose?.(),
                    onAutoClose: () => onClose?.(),
                }
            );
        };


/**
 * notify
 *
 * Cómo se pide un aviso flotante desde cualquier sitio:
 *
 *   notify.success("Categoría creada");
 *   notify.error("No se pudo guardar", { duration: null });
 *
 * Es una función y no un hook porque un aviso se lanza casi siempre desde
 * donde no hay render: el `onSuccess` de una mutación, el `catch` de un
 * servicio, un manejador de evento. Un `useNotify()` obligaría a arrastrar el
 * resultado del hook hasta ahí y no daría nada a cambio — sonner mantiene la
 * cola fuera de React a propósito.
 *
 * El tono se elige llamando al método, no con un parámetro, para que el aviso
 * se lea en el sitio donde se escribe: `notify.error(…)` en la rama de error
 * dice lo mismo que la rama.
 */
export const notify = {
    /** Un dato de contexto: algo que conviene saber, sin nada que hacer. */
    info: notifyWithTone("info"),

    /** Salió bien. Lo más habitual: confirma que la acción llegó al servidor. */
    success: notifyWithTone("success"),

    /** Algo pide atención, pero no ha fallado. */
    warning: notifyWithTone("warning"),

    /**
     * Falló. Si el usuario tiene que hacerse cargo —reintentar, corregir un
     * dato—, va con `duration: null` para que no se vaya solo.
     */
    error: notifyWithTone("error"),

    /** Sin color: un aviso que sólo informa de un cambio. */
    neutral: notifyWithTone("neutral"),

    /**
     * Retira un aviso antes de tiempo, o todos si no se dice cuál.
     *
     * Sirve para el aviso persistente que ya no viene a cuento: el "Sin
     * conexión" que se quita solo cuando la petición siguiente responde.
     */
    dismiss: (id?: string | number) => toast.dismiss(id),
};
