"use client";

// ── Miniatura del producto ──────────────────────────────────────────────────
// La foto la publica el backend como URL y Next la descarga y optimiza. Como
// puede no existir todavía —o caerse la descarga— siempre hay debajo una capa
// con las iniciales del nombre: la tarjeta nunca enseña un hueco roto.
//
// Es cliente por `onError`: es la única forma de enterarse de que una URL
// remota no respondió. El resto de la tarjeta sigue siendo servidor.

import * as React from "react";
import Image from "next/image";

import type { ProductThumbnailProps } from "@/interfaces";
import { getProductInitials } from "@/lib/products";

import {
    productThumbnailFallbackVariants,
    productThumbnailImageVariants,
    productThumbnailVariants,
} from "./product-thumbnail.style";


/**
 * Ancho real de la miniatura en la rejilla.
 *
 * Las columnas son `minmax(15rem, 1fr)`: a partir de ~1280px caben cuatro y
 * cada tarjeta se queda en torno a 15rem, así que pedir más píxeles solo
 * gastaría ancho de banda.
 */
const THUMBNAIL_SIZES = "(max-width: 48rem) 100vw, (max-width: 80rem) 33vw, 15rem";


export default function ProductThumbnail({
    name,
    src,
    dimmed = false,
}: ProductThumbnailProps) {
    // Se guarda la URL que falló, no un booleano: si el producto se edita y
    // llega una foto nueva, esta merece su propio intento sin necesidad de un
    // efecto que reinicie el estado.
    const [failedSrc, setFailedSrc] = React.useState<string | null>(null);

    const showImage = Boolean(src) && src !== failedSrc;

    return (
        // Decorativa en bloque: el nombre del producto va justo debajo, y
        // anunciar "HD" antes de leerlo solo estorba.
        <div aria-hidden="true" className={productThumbnailVariants()}>
            {/* Las iniciales viven siempre debajo: hacen de respaldo cuando no
                hay foto y de marcador de posición mientras la foto carga. */}
            <span className={productThumbnailFallbackVariants({ dimmed })}>
                {getProductInitials(name)}
            </span>

            {showImage && (
                <Image
                    src={src as string}
                    alt=""
                    fill
                    sizes={THUMBNAIL_SIZES}
                    onError={() => setFailedSrc(src ?? null)}
                    className={productThumbnailImageVariants({ dimmed })}
                />
            )}
        </div>
    );
};
