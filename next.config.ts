import type { NextConfig } from "next";

/**
 * Origen desde el que se sirven las fotos de producto, ej.
 * `https://cdn.mi-backend.com`. Se declara en `.env` como
 * `NEXT_PUBLIC_PRODUCT_IMAGES_ORIGIN`.
 *
 * Next solo optimiza imágenes remotas de orígenes declarados: sin esto, una
 * URL del backend revienta en tiempo de ejecución. Se lee de entorno en lugar
 * de escribirlo aquí a mano para que desarrollo, pruebas y producción no
 * necesiten configuraciones distintas del repositorio, y se limita a un
 * origen concreto en vez de un comodín — un `hostname: "**"` deja que
 * cualquiera use tu optimizador de imágenes.
 */
const productImagesOrigin = process.env["NEXT_PUBLIC_PRODUCT_IMAGES_ORIGIN"];

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Mientras no haya origen configurado no se declara nada: el catálogo de
  // ejemplo no trae fotos y las tarjetas caen a las iniciales del producto.
  ...(productImagesOrigin
    ? {
        images: {
          remotePatterns: [
            new URL(`${productImagesOrigin.replace(/\/+$/, "")}/**`),
          ],
        },
      }
    : {}),
};

export default nextConfig;
