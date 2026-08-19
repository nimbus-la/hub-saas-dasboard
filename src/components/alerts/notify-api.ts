import { NotifyOptions } from "@/interfaces";
import { resolveApiAlert } from "@/lib/http";

import { notify } from "./AlertToaster";


/**
 * Muestra el aviso que corresponda a una respuesta del backend, si es que
 * corresponde alguno.
 *
 * Todo lo interesante lo decidió `resolveApiAlert`; esto sólo lo lleva a la
 * pila. Por eso son ocho líneas: la parte que se puede equivocar es pura y
 * está en `lib/http`, y la que toca la interfaz no tiene ninguna rama que
 * probar.
 */
export function notifyApi(source: unknown, options: NotifyOptions = {}): void {
    const alert = resolveApiAlert(source);

    if (!alert) return;

    notify[alert.tone](alert.message, options);
}