"use client";

import * as React from "react";

import {
  loginFormFieldsVariants,
  loginFormHeaderVariants,
  loginFormVariants,
} from "./login-form.style";

import { GenericButton, TextField } from "@/components";
import { cn } from "@/lib/utils";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data: LoginFormData = {
      email,
      password,
      rememberMe,
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
          Ingresa tu correo electrónico y contraseña para acceder a tu cuenta.
        </p>
      </div>

      {/* ── Campos ───────────────────────────────────────────── */}
      <div className={cn("mt-8 w-full max-w-md", loginFormFieldsVariants())}>
        <TextField
          id="login-email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={setEmail}
          size="md"
          autoComplete="email"
          required
        />

        <TextField
          id="login-password"
          label="Password"
          type="password"
          placeholder="Enter your password"
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
