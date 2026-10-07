"use client";

import { Controller, useForm } from "react-hook-form";

import { GenericButton, TextField } from "@/components";
import { messages } from "@/messages";

import { LoginCredentials, LoginFormProps } from "../interfaces";

import {
  loginFormActionsVariants,
  loginFormFieldsVariants,
  loginFormHeaderVariants,
  loginFormSubtitleVariants,
  loginFormTitleVariants,
  loginFormVariants,
} from "./login-form.style";


const texts = messages.auth.login;


export default function LoginForm({ onSubmit, isPending }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginCredentials>({
    mode: "onChange",
    defaultValues: {
      tenantSlug: "",
      username: "",
      password: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={loginFormVariants()}>
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
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              id="login-tenant"
              label={texts.fields.tenantSlug.label}
              placeholder={texts.fields.tenantSlug.placeholder}
              type="text"
              size="md"
              autoComplete="organization"
              required
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              id="login-username"
              label={texts.fields.username.label}
              placeholder={texts.fields.username.placeholder}
              type="text"
              size="md"
              autoComplete="username"
              required
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              {...field}
              id="login-password"
              label={texts.fields.password.label}
              placeholder={texts.fields.password.placeholder}
              type="password"
              size="md"
              autoComplete="current-password"
              required
            />
          )}
        />
      </div>

      {/* ── Botón ────────────────────────────────────────────── */}
      <div className={loginFormActionsVariants()}>
        <GenericButton
          type="submit"
          size="md"
          label={isPending ? texts.submitting : texts.submit}
          className="w-full"
          disabled={!isValid || isPending}
        />
      </div>
    </form>
  );
}