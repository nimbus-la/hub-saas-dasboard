/**
 * Token con el que se autentican las peticiones al backend.
 *
 * Es provisional: mientras llega la sesión real se lee un JWT fijo de la
 * variable de entorno. El cliente HTTP sólo conoce esta función, así que el día
 * que exista la sesión basta con cambiar lo que devuelve (cookie, store,
 * refresco) y ni la fábrica ni los servicios se enteran.
 *
 * Lleva el prefijo `NEXT_PUBLIC_` porque las pantallas cliente piden desde el
 * navegador con la misma instancia que el servidor, y Next sólo inyecta al
 * bundle esas variables. Eso deja el token a la vista en el JavaScript servido:
 * vale para desarrollo con un token de pruebas y en ningún caso para producción.
 *
 * Una variable vacía se trata como ausente para no mandar `Bearer ` sin token,
 * que el backend leería como un token inválido en vez de como uno que falta.
 */
export const getAccessToken = (): string | undefined =>
    process.env["NEXT_PUBLIC_API_ACCESS_TOKEN"] || undefined;
