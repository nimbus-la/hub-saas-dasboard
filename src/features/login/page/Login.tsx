"use client";

import LoginForm from "../components/login-form/LoginForm";
import Link from "next/link";
import { ICON_TOKENS } from "@/tokens";
import Image from "next/image";

const LOGO_SIZE = 28;

export default function Login() {
  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-4xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Vorea — ir al inicio"
          className="absolute left-6 top-5 z-10 flex items-center gap-2"
        >
          <ICON_TOKENS.FLAME
            size={LOGO_SIZE}
            aria-hidden="true"
            fill="var(--color-primary-main)"
            stroke="var(--color-primary-main)"
          />

          <span className="text-lg font-bold text-neutral-900">Vorea</span>
        </Link>

        {/* Formulario */}
        <section className="flex w-full items-center justify-center px-16 py-8 lg:w-1/2">
          <LoginForm
            onSubmit={async (data) => {
              console.log("Login:", data);
            }}
          />
        </section>

        {/* Panel visual */}
        <section className="hidden lg:flex lg:w-1/2">
          <div className="flex w-full flex-col bg-primary-main px-10 pb-10 pt-16 text-white">
            <h1 className="text-h3">
              Gestiona tu equipo y tus operaciones sin esfuerzo.
            </h1>

            <p className="mt-3 max-w-md text-body-md text-white/80">
              Inicia sesión para acceder al panel de control de tu CRM y
              gestionar tu equipo.
            </p>

            {/* Preview del dashboard */}
            <div className="mt-8 flex flex-1 items-center justify-center">
              <div className="w-full max-w-md overflow-hidden rounded-2xl">
                <Image
                  src="/images/login/dashboard-preview.png"
                  alt="Vista previa del dashboard de Vorea"
                  width={800}
                  height={500}
                  className="block h-auto w-full object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
