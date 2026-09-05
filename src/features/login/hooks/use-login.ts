import { useState } from "react";
import { LoginCredentials, LoginResponse } from "../types/login.types";
import { login } from "../services/login.service";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (
    credentials: LoginCredentials,
  ): Promise<LoginResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      return await login(credentials);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al iniciar sesión";

      setError(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  return {
    login: handleLogin,
    isLoading,
    error,
  };
};
