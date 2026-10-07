"use client";

import React from "react";
import { Controller, useForm } from "react-hook-form";

import { GenericButton, TextField } from "@/components";
import { messages } from "@/messages";

import { LoginCredentials, LoginFormProps } from "../interfaces";
import { LOGIN_FORM_RULES, toLoginCredentials } from "../libs";

import {
  loginFormActionsVariants,
  loginFormFieldsVariants,
  loginFormHeaderVariants,
  loginFormSubtitleVariants,
  loginFormTitleVariants,
  loginFormVariants,
} from "./login-form.style";


const texts = messages.auth.login;


export default function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    setFocus,
    formState: { isValid, isSubmitting },
  } = useForm<LoginCredentials>({
    // Los errores aparecen al salir del campo y no con la primera tecla: nadie
    // necesita que le digan que falta su usuario mientras lo está escribiendo.
    mode: "onTouched",
    defaultValues: {
      tenantSlug: "",
      username: "",
      password: "",
    },
  });

  // `isSubmitting` llega en el siguiente render, y un doble clic o un Enter
  // repetido entran antes. Sin este candado salen dos inicios de sesión y el
  // backend abre dos sesiones.
  const inFlightRef = React.useRef(false);

  // No sirve `isSubmitSuccessful`: el fallo se captura aquí abajo, así que
  // para react-hook-form todos los envíos salen bien.
  const [isRedirecting, setIsRedirecting] = React.useState(false);

  const submit = async (values: LoginCredentials) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      await onSubmit(toLoginCredentials(values));
      // Si sale bien el candado se queda puesto: la pantalla está navegando y
      // otro envío solo abriría otra sesión.
      setIsRedirecting(true);
    } catch {
      inFlightRef.current = false;
      // Lo más probable es que haya que corregir la contraseña; seleccionarla
      // deja escribir encima o reintentar con Enter.
      setFocus("password", { shouldSelect: true });
    }
  };

  // Tras un inicio correcto el botón sigue ocupado hasta que llega el panel.
  const isBusy = isSubmitting || isRedirecting;

  return (
    // `handleSubmit` se arma dentro del evento: armado en el render, el
    // compilador no puede saber que el candado solo se lee al enviar.
    <form onSubmit={(event) => handleSubmit(submit)(event)} className={loginFormVariants()} noValidate>
      {/* ── Encabezado ───────────────────────────────────────── */}
      <div className={loginFormHeaderVariants()}>
        <h1 className={loginFormTitleVariants()}>{texts.title}</h1>
        <p className={loginFormSubtitleVariants()}>{texts.subtitle}</p>
      </div>

      {/* ── Campos ───────────────────────────────────────────── */}
      <div className={loginFormFieldsVariants()}>
        <Controller
          name="tenantSlug"
          control={control}
          rules={LOGIN_FORM_RULES.tenantSlug}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              id="login-tenant"
              label={texts.fields.tenantSlug.label}
              placeholder={texts.fields.tenantSlug.placeholder}
              type="text"
              size="md"
              autoComplete="organization"
              required
              error={fieldState.error?.message ?? false}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          rules={LOGIN_FORM_RULES.username}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              id="login-username"
              label={texts.fields.username.label}
              placeholder={texts.fields.username.placeholder}
              type="text"
              size="md"
              autoComplete="username"
              required
              error={fieldState.error?.message ?? false}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={LOGIN_FORM_RULES.password}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              id="login-password"
              label={texts.fields.password.label}
              placeholder={texts.fields.password.placeholder}
              type="password"
              size="md"
              autoComplete="current-password"
              required
              error={fieldState.error?.message ?? false}
            />
          )}
        />
      </div>

      {/* ── Botón ────────────────────────────────────────────── */}
      <div className={loginFormActionsVariants()}>
        <GenericButton
          type="submit"
          size="md"
          label={isBusy ? texts.submitting : texts.submit}
          fullWidth
          disabled={!isValid || isBusy}
        />
      </div>
    </form>
  );
}
