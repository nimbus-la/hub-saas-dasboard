"use client";

import Link from "next/link";
import Image from "next/image";

import { ICON_TOKENS } from "@/tokens";
import { messages } from "@/messages";
import { useLogin } from "../hooks";
import { LoginCredentials } from "../interfaces";
import { LoginForm } from "../components";

import {
  loginPageBrandNameVariants,
  loginPageBrandVariants,
  loginPageCardVariants,
  loginPageFormSectionVariants,
  loginPagePreviewFrameVariants,
  loginPagePreviewImageVariants,
  loginPagePreviewVariants,
  loginPageShowcaseDescriptionVariants,
  loginPageShowcaseSectionVariants,
  loginPageShowcaseTitleVariants,
  loginPageShowcaseVariants,
  loginPageVariants
} from "../style";


const LOGO_SIZE = 28;


const authMessages = messages.auth;

export default function Login() {
  const { mutate: login, isPending } = useLogin();

  return (
    <main className={loginPageVariants()}>
      <div className={loginPageCardVariants()}>
        {/* Logo */}
        <Link
          href="/"
          aria-label="Vorea — ir al inicio"
          className={loginPageBrandVariants()}
        >
          <ICON_TOKENS.FLAME
            size={LOGO_SIZE}
            aria-hidden="true"
            fill="var(--color-primary-main)"
            stroke="var(--color-primary-main)"
          />

          <span className={loginPageBrandNameVariants()}>Vorea</span>
        </Link>

        {/* Formulario */}
        <section className={loginPageFormSectionVariants()}>
          <LoginForm onSubmit={(credentials: LoginCredentials) => login(credentials)} isPending={isPending} />
        </section>

        {/* Panel visual */}
        <section className={loginPageShowcaseSectionVariants()}>
          <div className={loginPageShowcaseVariants()}>
            <h2 className={loginPageShowcaseTitleVariants()}>
              {authMessages.showcase.title}
            </h2>

            <p className={loginPageShowcaseDescriptionVariants()}>
              {authMessages.showcase.description}
            </p>

            {/* Preview del dashboard */}
            <div className={loginPagePreviewVariants()}>
              <div className={loginPagePreviewFrameVariants()}>
                <Image
                  src="/images/login/dashboard-preview.png"
                  alt={authMessages.showcase.previewAlt}
                  width={800}
                  height={500}
                  className={loginPagePreviewImageVariants()}
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
