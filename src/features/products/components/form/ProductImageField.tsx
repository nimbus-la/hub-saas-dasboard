"use client";

import * as React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

import GenericButton from "@/components/buttons/GenericButton";
import { cn } from "@/lib/utils";
import { formatMessage, messages } from "@/messages";
import {
    AVATAR_SIZE,
    ICON_SIZE,
    ICON_STROKE_BY_SIZE,
    ICON_TOKENS,
} from "@/tokens";
import {
    PRODUCT_IMAGE_ACCEPT,
    PRODUCT_IMAGE_FORMATS_LABEL,
    PRODUCT_IMAGE_MAX_BYTES,
    formatFileSize,
    validateProductImage,
} from "@/features/products/libs/product-form";

import {
    productImageDropzoneCaptionVariants,
    productImageDropzoneTextVariants,
    productImageDropzoneTitleVariants,
    productImageDropzoneVariants,
    productImageErrorVariants,
    productImageFileMetaVariants,
    productImageFileNameVariants,
    productImageFieldVariants,
    productImageHintVariants,
    productImageIconVariants,
    productImageLabelVariants,
    productImagePreviewActionsVariants,
    productImagePreviewTextVariants,
    productImagePreviewVariants,
    productImageThumbnailVariants,
} from "./product-image-field.style";


/**
 * Campo de imagen del producto
 *
 * Suelta o selección de un archivo, con vista previa antes de guardar. La foto
 * no se sube aquí: se queda en memoria como `File` y viaja con el resto del
 * formulario en el último paso. Hasta entonces la previsualización es un
 * objeto de blob local, que es también el motivo de que este componente sea
 * de cliente y de que revoque la URL cuando deja de usarla — cada `File`
 * previsualizado y no revocado se queda en memoria hasta recargar la página.
 */

/** Lo que dice este campo. Ver `@/messages`. */
const COPY = messages.products.create.image;

interface ProductImageFieldProps {
    value: File | null;
    /** Sólo recibe archivos que pasaron la validación, o `null` al quitarlos. */
    onChange: (file: File | null) => void;
    /** Identificador del control. Se genera uno si no se pasa. */
    id?: string;
    className?: string;
}

export default function ProductImageField({
    value,
    onChange,
    id,
    className,
}: ProductImageFieldProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const reactId = React.useId();
    const fieldId = id ?? reactId;
    const hintId = `${fieldId}-hint`;
    const errorId = `${fieldId}-error`;

    const [isDragging, setIsDragging] = React.useState(false);
    const [rejection, setRejection] = React.useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    /**
     * La URL viva ahora mismo, para poder retirarla al sustituirla.
     *
     * La vista previa se crea y se destruye en los manejadores, no en un
     * efecto que observe `value`: crear un blob es un efecto secundario con
     * dueño —el archivo que acaba de entrar— y colgarlo de un efecto obliga a
     * un render de más por cada foto elegida.
     */
    const previewUrlRef = React.useRef<string | null>(null);

    const replacePreview = React.useCallback((file: File | null) => {
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);

        const nextUrl = file ? URL.createObjectURL(file) : null;
        previewUrlRef.current = nextUrl;
        setPreviewUrl(nextUrl);
    }, []);

    // Última red: si la pantalla se desmonta con una foto elegida, el blob se
    // quedaría en memoria hasta recargar la página.
    React.useEffect(
        () => () => {
            if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
        },
        []
    );

    const openFilePicker = React.useCallback(() => {
        inputRef.current?.click();
    }, []);

    const acceptFile = React.useCallback(
        (file: File | undefined) => {
            if (!file) return;

            const message = validateProductImage(file);

            if (message) {
                // El archivo rechazado no sustituye al que ya hubiera: quien
                // intenta cambiar la foto y falla se queda con la anterior, no
                // sin ninguna.
                setRejection(message);

                return;
            }

            setRejection(null);
            replacePreview(file);
            onChange(file);
        },
        [onChange, replacePreview]
    );

    const handleInputChange = React.useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            acceptFile(event.target.files?.[0]);
            // Vaciar el control permite volver a elegir el mismo archivo: sin
            // esto, corregir una foto y reintentar la misma no dispara nada.
            event.target.value = "";
        },
        [acceptFile]
    );

    const handleDrop = React.useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            setIsDragging(false);
            acceptFile(event.dataTransfer.files?.[0]);
        },
        [acceptFile]
    );

    const handleDragOver = React.useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            // Sin `preventDefault` el navegador abre el archivo en la pestaña y
            // el formulario a medio llenar se pierde.
            event.preventDefault();
            setIsDragging(true);
        },
        []
    );

    const handleDragLeave = React.useCallback(() => setIsDragging(false), []);

    const handleRemove = React.useCallback(() => {
        setRejection(null);
        replacePreview(null);
        onChange(null);
    }, [onChange, replacePreview]);

    const describedBy = rejection ? `${hintId} ${errorId}` : hintId;

    return (
        <div className={cn(productImageFieldVariants(), className)}>
            <label htmlFor={fieldId} className={productImageLabelVariants()}>
                {COPY.label}
            </label>

            <p id={hintId} className={productImageHintVariants()}>
                {COPY.hint}
            </p>

            {/*
                El control real queda fuera de la vista pero dentro del árbol de
                accesibilidad. No es tabulable a propósito: el botón visible de
                abajo hace de disparador, y tener los dos en el recorrido daría
                dos paradas de teclado para la misma acción.
            */}
            <input
                ref={inputRef}
                id={fieldId}
                type="file"
                accept={PRODUCT_IMAGE_ACCEPT}
                tabIndex={-1}
                aria-describedby={describedBy}
                onChange={handleInputChange}
                className="sr-only"
            />

            {value && previewUrl ? (
                <div className={productImagePreviewVariants()}>
                    <div className={productImageThumbnailVariants()}>
                        {/*
                            `unoptimized`: la fuente es un blob local que sólo
                            existe en esta pestaña, así que no hay nada que el
                            optimizador de Next pueda descargar ni cachear.
                        */}
                        <Image
                            src={previewUrl}
                            alt=""
                            fill
                            unoptimized
                            sizes={`${AVATAR_SIZE["2xl"].size}px`}
                            className="object-cover"
                        />
                    </div>

                    <div className={productImagePreviewTextVariants()}>
                        <p className={productImageFileNameVariants()}>
                            {value.name}
                        </p>

                        <p className={productImageFileMetaVariants()}>
                            {formatFileSize(value.size)} · {COPY.ready}
                        </p>
                    </div>

                    <div className={productImagePreviewActionsVariants()}>
                        <GenericButton
                            type="button"
                            variant="ghost"
                            size="sm"
                            label={messages.common.actions.change}
                            onClick={openFilePicker}
                        />

                        <GenericButton
                            type="button"
                            variant="danger"
                            size="sm"
                            label={messages.common.actions.remove}
                            startIcon={Trash2}
                            onClick={handleRemove}
                        />
                    </div>
                </div>
            ) : (
                <div
                    onClick={openFilePicker}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={productImageDropzoneVariants({
                        dragging: isDragging,
                        invalid: Boolean(rejection),
                    })}
                >
                    <span aria-hidden="true" className={productImageIconVariants()}>
                        <ICON_TOKENS.UPLOAD_IMAGE
                            size={ICON_SIZE["2xl"]}
                            strokeWidth={ICON_STROKE_BY_SIZE["2xl"]}
                        />
                    </span>

                    <div className={productImageDropzoneTextVariants()}>
                        <p className={productImageDropzoneTitleVariants()}>
                            {COPY.dropzoneTitle}
                        </p>

                        <p className={productImageDropzoneCaptionVariants()}>
                            {formatMessage(COPY.dropzoneCaption, {
                                formats: PRODUCT_IMAGE_FORMATS_LABEL,
                                max: formatFileSize(PRODUCT_IMAGE_MAX_BYTES),
                            })}
                        </p>
                    </div>

                    {/* `ghost` y no `secondary`: el texto de la variante
                        secundaria es `neutral-500` y sobre el blanco de la zona
                        se queda en 3,2:1, por debajo del mínimo legible. */}
                    <GenericButton
                        type="button"
                        variant="ghost"
                        size="sm"
                        label={messages.common.actions.selectFile}
                        aria-describedby={hintId}
                        // La zona entera es pulsable; sin frenar la propagación
                        // el clic del botón abriría el selector dos veces.
                        onClick={(event) => {
                            event.stopPropagation();
                            openFilePicker();
                        }}
                    />
                </div>
            )}

            {rejection && (
                <p
                    id={errorId}
                    role="alert"
                    className={productImageErrorVariants()}
                >
                    {rejection}
                </p>
            )}
        </div>
    );
};
