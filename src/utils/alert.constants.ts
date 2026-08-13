import { LucideIcon } from "lucide-react";

import { AlertSize, AlertTone } from "@/interfaces";
import { CONTROL_SIZE, ICON_TOKENS } from "@/tokens";


/**
 * Cuánto dura un aviso en pantalla.
 *
 * Cinco segundos: por debajo de tres no da tiempo a leer dos líneas y por
 * encima de siete el aviso deja de ser un apunte y se queda estorbando. No es
 * un token de movimiento —esos miden animaciones, y el más largo son 500ms—:
 * es cuánto tiempo se deja algo a la vista, que es una decisión de producto.
 *
 * Lo que no cabe en cinco segundos no es un aviso pasajero. Ahí va
 * `duration={null}` y se cierra a mano.
 */
export const ALERT_DURATION = 5000;



/** Icono por defecto de cada tono. Se sustituye con la prop `icon`. */
export const DEFAULT_ICON = {
    info: ICON_TOKENS.INFO,
    success: ICON_TOKENS.SUCCESS,
    warning: ICON_TOKENS.WARNING,
    error: ICON_TOKENS.ERROR,
    neutral: ICON_TOKENS.INFO,
} as const satisfies Record<AlertTone, LucideIcon>;



/**
 * Lado del medallón, por tamaño de aviso.
 *
 * Sale de `CONTROL_SIZE` y no de `ICON_SIZE`: la escala de iconos se corta en
 * 24px porque un icono acompaña a un texto, y el medallón no acompaña a nada
 * —es la pieza de color del aviso—. Es el mismo criterio con el que el diálogo
 * de confirmación toma de ahí el lado de su medallón.
 */
export const MEDIA_SIZE = {
    sm: CONTROL_SIZE.sm.height,
    md: CONTROL_SIZE.md.height,
} as const satisfies Record<AlertSize, number>;



/**
 * Tonos que interrumpen al lector de pantalla.
 *
 * `role="alert"` corta lo que se esté leyendo; `role="status"` espera turno.
 * Un error y un aviso de atención sí valen la interrupción —hay algo que
 * atender—; una confirmación o un dato de contexto, no: cortar la lectura para
 * decir "guardado" es exactamente el ruido que hace que la gente apague las
 * notificaciones.
 */
export const ASSERTIVE_TONES: readonly AlertTone[] = ["error", "warning"];