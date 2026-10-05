/**
 * Forma de un UUID: cinco grupos hexadecimales de 8-4-4-4-12. No revisa la
 * versión porque el backend genera ids de varias, y lo único que importa aquí
 * es si vale la pena preguntarle por ese id.
 */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


/**
 * Si el texto tiene forma de UUID.
 *
 * Sirve para los ids que llegan por la URL. El backend rechaza uno mal escrito
 * como si fuera un error de la petición, cuando para quien lo abrió es
 * simplemente algo que no existe.
 */
export const isUuid = (value: string): boolean => UUID_PATTERN.test(value);
