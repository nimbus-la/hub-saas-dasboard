// ── Dominio: formulario de inicio de sesión ─────────────────────────────────
// Reglas de los campos y la limpieza de los valores antes de enviarlos. Vive
// fuera del componente por lo mismo que `employee-form.ts`: es texto y reglas,
// y el formulario solo decide cómo se pintan.

import type { RegisterOptions } from "react-hook-form";

import { messages } from "@/messages";

import { LoginCredentials } from "../interfaces";


const VALIDATION = messages.auth.login.validation;


/**
 * Un valor hecho solo de espacios no es un valor. `required` lo daría por
 * bueno, porque la cadena no está vacía.
 */
const notBlank = (message: string) => (value: string) => value.trim() !== "" || message;


/**
 * Reglas de cada campo.
 *
 * La contraseña solo exige que exista: los espacios pueden ser parte de ella,
 * y quitarlos o rechazarlos aquí cambiaría lo que el usuario escribió.
 */
export const LOGIN_FORM_RULES = {
    tenantSlug: { validate: notBlank(VALIDATION.tenantSlugRequired) },
    username: { validate: notBlank(VALIDATION.usernameRequired) },
    password: { required: VALIDATION.passwordRequired },
} satisfies { [K in keyof LoginCredentials]: RegisterOptions<LoginCredentials, K> };


/**
 * Credenciales tal como viajan al backend. La empresa y el usuario se recortan
 * porque un espacio pegado al copiar no es parte de ellos.
 */
export const toLoginCredentials = ({ tenantSlug, username, password }: LoginCredentials): LoginCredentials => ({
    tenantSlug: tenantSlug.trim(),
    username: username.trim(),
    password,
});
