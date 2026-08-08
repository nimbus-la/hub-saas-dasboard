/**
 * Mensajes de error
 *
 * Lo que se le dice a quien mira cuando algo no salió. Están redactados en
 * términos de lo que le pasa —no "ERR_CONNECTION_REFUSED"— y terminan
 * sugiriendo la acción siguiente: un error que no dice qué hacer es una
 * pantalla muerta.
 *
 * Sólo los que redacta la aplicación. Cuando el backend explica el fallo, gana
 * el backend: `getApiErrorMessage` saca el texto del cuerpo de la respuesta y
 * estos quedan como reserva para los casos en los que no hubo respuesta de la
 * que sacar nada.
 */


export const errors = {

    /* ── Transporte ─────────────────────────────────────────────────────── */
    // No hubo respuesta, así que no hay cuerpo del que sacar un texto: lo pone
    // la aplicación. Son los dos únicos fallos que la capa HTTP sabe nombrar
    // por su cuenta.

    http: {
        network: "No se pudo conectar con el servidor. Revisa tu conexión.",
        timeout: "El servidor tardó demasiado en responder. Vuelve a intentarlo.",
    },


    /* ── Reserva ────────────────────────────────────────────────────────── */

    /**
     * Último recurso.
     *
     * Se usa cuando ni el backend explicó el fallo ni la pantalla tiene un
     * mensaje propio para él. Que haga falta suele significar que a esa
     * operación le falta su mensaje: es genérico a propósito, para que se note.
     */
    unexpected: "Algo salió mal. Vuelve a intentarlo.",
} as const;
