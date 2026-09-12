import { formatPlural, messages } from "@/messages";
import { ICON_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import {
    productRecipeCardVariants,
    productRecipeEmptyIconVariants,
    productRecipeEmptyMessageVariants,
    productRecipeEmptyTextVariants,
    productRecipeEmptyTitleVariants,
    productRecipeEmptyVariants,
    productRecipeListCountVariants,
    productRecipeListHeaderVariants,
    productRecipeListTitleVariants,
    productRecipeListVariants,
    productRecipeStepVariants
} from "./product-recipe-step.style";


export default function ProductRecipeStep() {
    const message = messages.products.create.recipe;

    const lines = false

    return (
        <fieldset className={productRecipeStepVariants()}>
            <legend className="sr-only">{message.legend}</legend>

            {/* Barra de busqueda. */}

            <div className={productRecipeListVariants()}>
                <div className={productRecipeListHeaderVariants()}>
                    <h3 className={productRecipeListTitleVariants()}>
                        {message.list.title}
                    </h3>

                    <p aria-live="polite" className={productRecipeListCountVariants()}>
                        {formatPlural(message.list.count, 0)}
                    </p>
                </div>
            </div>

            <div className={productRecipeCardVariants()}>
                {
                    lines ? (
                        <>
                            <h1>Tabla de insumos...</h1>
                        </>
                    ) : (
                        <div className={productRecipeEmptyVariants()}>
                            <span
                                aria-hidden="true"
                                className={productRecipeEmptyIconVariants()}
                            >
                                <ICON_TOKENS.INVENTORY
                                    size={ICON_SIZE["2xl"]}
                                    strokeWidth={ICON_STROKE_BY_SIZE["2xl"]}
                                />
                            </span>

                            <div className={productRecipeEmptyTextVariants()}>
                                <p className={productRecipeEmptyTitleVariants()}>
                                    {message.list.empty.title}
                                </p>

                                <p className={productRecipeEmptyMessageVariants()}>
                                    {message.list.empty.message}
                                </p>
                            </div>
                        </div>
                    )
                }
            </div>
        </fieldset>
    )
}