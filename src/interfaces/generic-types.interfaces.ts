
/** Mismo objeto, pero cada campo puede tener valor null. */
export type Nullable<T> = {
    [K in keyof T]: T[K] | null;
}