/**
 * @file Tipos — punto de entrada único
 * 
 * @description
 * Este archivo actúa como un punto de entrada único para todas las interfaces
 * y tipos utilizados en la aplicación. Se organiza en tres categorías principales:
 * 
 * 1. `components/`: Contiene las interfaces de props de los componentes, con un
 *    archivo por familia de componentes.
 * 2. `tokens/`: Contiene la forma de las recetas del design system.
 * 3. `*.types.ts`: Contiene tipos relacionados con el dominio y augmentación de
 *    librerías externas.
 */

/** Props de componentes */
export * from "./components";


/** Dominio */
export * from "./menu.types";


/** Tokens */
export * from "./tokens/sizes-token.interface";
export * from "./tokens/elevation-token.interface";
