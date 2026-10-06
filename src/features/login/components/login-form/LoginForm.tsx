"use client";

import { Controller, useForm } from "react-hook-form";

import {
  loginFormFieldsVariants,
  loginFormHeaderVariants,
  loginFormVariants,
} from "./login-form.style";

import { GenericButton, TextField } from "@/components";
import { cn } from "@/lib/utils";

import type { LoginCredentials } from "../../types/login.types";

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
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
      <div className={cn("text-center", loginFormHeaderVariants())}>
        <h1 className="text-h2 font-bold text-neutral-900">
          Bienvenidos
        </h1>

        <p className="text-body-sm text-neutral-600">
          Ingresa tus datos para acceder a tu cuenta.
        </p>
      </div>

      {/* ── Campos ───────────────────────────────────────────── */}
      <div
        className={cn(
          "mt-8 w-full max-w-md",
          loginFormFieldsVariants()
        )}
      >
        <Controller
          name="tenantSlug"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              id="login-tenant"
              label="Empresa"
              type="text"
              placeholder="Ingresa tu nombre de empresa"
              size="md"
              required
              {...(fieldState.error?.message
                ? { error: fieldState.error.message }
                : {})}
            />
          )}
        />

        <Controller
          name="username"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              id="login-username"
              label="Usuario"
              type="text"
              placeholder="Ingresa tu usuario"
              size="md"
              autoComplete="username"
              required
              {...(fieldState.error?.message
                ? { error: fieldState.error.message }
                : {})}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          rules={{
            required: true,
          }}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              id="login-password"
              label="Contraseña"
              type="password"
              placeholder="Ingresa tu contraseña"
              size="md"
              autoComplete="current-password"
              required
              {...(fieldState.error?.message
                ? { error: fieldState.error.message }
                : {})}
            />
          )}
        />
      </div>

      {/* ── Botón ────────────────────────────────────────────── */}
      <div className="mt-6">
        <GenericButton
          type="submit"
          size="md"
          label={
            isSubmitting
              ? "Iniciando sesión..."
              : "Iniciar sesión"
          }
          className="w-full"
          disabled={!isValid || isSubmitting}
        >
          {isSubmitting
            ? "Iniciando sesión..."
            : "Iniciar sesión"}
        </GenericButton>
      </div>
    </form>
  );
}