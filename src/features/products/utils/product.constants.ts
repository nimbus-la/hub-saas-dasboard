import { formatMessage, messages } from "@/messages";
import { ProductFieldRules, ProductFormStep, ProductFormValues } from "../interfaces";
import { PRODUCT_CATEGORIES } from "@/lib/products";


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



export const PRODUCT_VALIDATION = {
    name: { min: 3, max: 60 },
    description: { min: 0, max: 280 }
} as const;



export const PRODUCT_FORM_RULES = {
    name: {
        required: message.validation.nameRequired,
        maxLength: {
            value: PRODUCT_VALIDATION.name.max,
            message: formatMessage(message.validation.nameMax, {
                max: PRODUCT_VALIDATION.name.max
            }),
        },

        validate: (value: string) =>
            value.trim().length >= PRODUCT_VALIDATION.name.min ||
            formatMessage(message.validation.nameMin, {
                min: PRODUCT_VALIDATION.name.min
            })
    } satisfies ProductFieldRules<"name">,

    category: {
        required: message.validation.categoryRequired
    } satisfies ProductFieldRules<"categoryId">,

    description: {
        maxLength: {
            value: PRODUCT_VALIDATION.description.max,
            message: formatMessage(message.validation.descriptionMax, {
                max: PRODUCT_VALIDATION.description.max
            }),
        },
    } satisfies ProductFieldRules<"description">
} as const;



export const PRODUCT_CATEGORY_OPTIONS = PRODUCT_CATEGORIES.map(category => ({
    label: category,
    value: category
}))