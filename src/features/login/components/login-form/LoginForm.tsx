"use client";

import * as React from "react";

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
  const [tenantSlug, setTenantSlug] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: LoginCredentials = {
      tenantSlug,
      username,
      password,
    };

    try {
      setIsSubmitting(true);

      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={loginFormVariants()}>
      {/* ── Encabezado ───────────────────────────────────────── */}
      <div className={cn("text-center", loginFormHeaderVariants())}>
        <h1 className="text-h2 font-bold text-neutral-900">Bienvenidos</h1>

        <p className="text-body-sm text-neutral-600">
          Ingresa tus datos para acceder a tu cuenta.
        </p>
      </div>

      {/* ── Campos ───────────────────────────────────────────── */}
      <div className={cn("mt-8 w-full max-w-md", loginFormFieldsVariants())}>
        <TextField
          id="login-tenant"
          label="Tenant"
          type="text"
          placeholder="Ingresa tu tenant"
          value={tenantSlug}
          onChange={setTenantSlug}
          size="md"
          required
        />

        <TextField
          id="login-username"
          label="Usuario"
          type="text"
          placeholder="Ingresa tu usuario"
          value={username}
          onChange={setUsername}
          size="md"
          autoComplete="username"
          required
        />

        <TextField
          id="login-password"
          label="Contraseña"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={password}
          onChange={setPassword}
          size="md"
          autoComplete="current-password"
          required
        />
      </div>

      {/* ── Botón ────────────────────────────────────────────── */}
      <div className="mt-6">
        <GenericButton
          type="submit"
          size="md"
          label={isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Iniciando sesión..." : "Iniciar sesión"}
        </GenericButton>
      </div>
    </form>
  );
}
