import { cn } from "@/lib/utils";
import { messages } from "@/messages";
import { ICON_SIZE, ICON_STROKE_BY_SIZE, ICON_TOKENS } from "@/tokens";

import type { RecipeEmptyStateProps } from "../../interfaces";
import {
    recipeEmptyStateIconVariants,
    recipeEmptyStateMessageVariants,
    recipeEmptyStateTextVariants,
    recipeEmptyStateTitleVariants,
    recipeEmptyStateVariants,
} from "./recipe-empty-state.style";


const emptyMessages = messages.products.create.recipe.list.empty;


/** Lo que se muestra mientras la receta no tiene insumos. */
export default function RecipeEmptyState({ className }: RecipeEmptyStateProps) {
    return (
        <div className={cn(recipeEmptyStateVariants(), className)}>
            <span aria-hidden="true" className={recipeEmptyStateIconVariants()}>
                <ICON_TOKENS.INVENTORY
                    size={ICON_SIZE["2xl"]}
                    strokeWidth={ICON_STROKE_BY_SIZE["2xl"]}
                />
            </span>

            <div className={recipeEmptyStateTextVariants()}>
                <p className={recipeEmptyStateTitleVariants()}>
                    {emptyMessages.title}
                </p>

                <p className={recipeEmptyStateMessageVariants()}>
                    {emptyMessages.message}
                </p>
            </div>
        </div>
    );
};
