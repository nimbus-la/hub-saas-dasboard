import { messages } from "@/messages";
import { ProductFormStep, ProductFormValues } from "../interfaces";


const message = messages.products.create;



export const DEFAULT_PRODUCT_FORM_VALUES: ProductFormValues = {
    name: "",
    categoryId: "",
    description: "",
    imageUrl: null,
    margin: "",
    price: "",
    recipe: []
}



export const BASICS_STEP: ProductFormStep = {
    id: "basics",
    title: message.steps.basics.label,
    subtitle: message.steps.basics.hint,
    fields: ["name", "categoryId", "description", "imageUrl"]
}



export const PRICING_STEP: ProductFormStep = {
    id: "pricing",
    title: message.steps.pricing.label,
    subtitle: message.steps.pricing.hint,
    fields: ["margin", "price"]
}



export const RECIPE_STEP: ProductFormStep = {
    id: "recipe",
    title: message.steps.recipe.label,
    subtitle: message.steps.recipe.hint,
    fields: ["recipe"]
}



export const PRODUCT_FORM_STEPS: readonly ProductFormStep[] = [
    BASICS_STEP,
    PRICING_STEP,
    RECIPE_STEP
]



export const PRODUCT_FORM_STEP_LENGTH = PRODUCT_FORM_STEPS.length;