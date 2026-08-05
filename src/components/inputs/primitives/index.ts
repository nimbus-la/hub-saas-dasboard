export { Input } from "./input"
export { Textarea } from "./textarea"

/**
 * Primitivos de campo
 * 
 * El material con el que están hechos `TextField`, `TextAreaField` e
 * `InputSelector`. Vienen de shadcn/base-ui y viven aquí, dentro de la
 * familia a la que sirven, ya traducidos al design system: no queda una sola
 * clase que apunte a las variables de shadcn (`border-input`, `bg-popover`,
 * `text-muted-foreground`…).
 * 
 * Para construir pantallas se usan los componentes públicos de `inputs/`.
 * Estos son para lo que se salga de ellos: un combobox con chips, un grupo
 * con prefijo y sufijo, un input pelado dentro de una celda.
 */

export {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "./input-group"

export {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxCollection,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxGroup,
    ComboboxInput,
    ComboboxItem,
    ComboboxItemIndicator,
    ComboboxLabel,
    ComboboxList,
    ComboboxSeparator,
    ComboboxTrigger,
    ComboboxValue,
    useComboboxAnchor,
} from "./combobox"
