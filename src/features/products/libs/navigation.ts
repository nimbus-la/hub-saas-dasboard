// ── Las rutas del módulo ────────────────────────────────────────────────────
// A dónde lleva cada enlace interno de productos. Escritas una vez y en un
// solo sitio: una ruta repetida por las pantallas es una ruta que el día que
// cambie se va a quedar a medias.

/** El listado, que es a donde se vuelve desde cualquier pantalla del módulo. */
export const PRODUCTS_LIST_HREF = "/products";


/** El alta de producto. Es la misma ruta que declara el menú lateral. */
export const PRODUCT_CREATE_HREF = "/products/create";


/**
 * La edición de un producto. El id va codificado porque llega de los datos y
 * no de una constante, y un carácter raro rompería la ruta en vez de dar 404.
 */
export const getProductEditHref = (productId: string): string =>
    `/products/edit/${encodeURIComponent(productId)}`;
