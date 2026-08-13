/**
 * Diccionario en español
 *
 * Junta los módulos en el objeto que consume la aplicación. Éste es además el
 * idioma de referencia: `Messages` —la forma que cualquier otro diccionario
 * tiene que cumplir— se deriva de aquí, así que una clave nueva en cualquiera
 * de los archivos de abajo es automáticamente una clave obligatoria para todos
 * los idiomas que vengan después.
 *
 * El nombre de cada bloque es la primera mitad de cualquier ruta de acceso
 * (`messages.products.categories.title`), así que se eligen por lo que
 * responden y no por dónde están los archivos.
 */

import { common } from "./common.messages";
import { components } from "./components.messages";
import { errors } from "./errors.messages";
import { navigation } from "./navigation.messages";
import { products } from "./products.messages";


export const es = {
    /** Botones, estados y formularios: lo que no pertenece a ningún módulo. */
    common,

    /** Valores por defecto de los componentes del design system. */
    components,

    /** Marca, barra superior y menú lateral. */
    navigation,

    /** Fallos que redacta la aplicación cuando el backend no puede. */
    errors,

    /** Módulo de productos: catálogo, alta y categorías. */
    products,
} as const;
