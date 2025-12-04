import type { AuthProvider } from "@refinedev/core";
import { cookies } from "next/headers";

import { API_URL } from "@providers/constants";

export const authProviderServer: Pick<AuthProvider, "check"> = {
  check: async () => {
    try {
      const cookieStore = await cookies();
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Cookie: cookieStore
            .getAll()
            .map((c) => `${c.name}=${c.value}`)
            .join("; "),
        },
        cache: "no-store",
      });

      if (res.status < 200 || res.status > 299) {
        console.warn("Auth check failed with status:", res.status);

        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
          error: {
            name: "Ошибка авторизации",
            message:
              "Что-то пошло не так, попробуй позже или обратись к администрации сайта",
          },
        };
      }

      return {
        authenticated: true,
      };
    } catch (error) {
      console.error("Auth check error:", error);
      // TODO: прологировать ошибку

      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
      };
    }
  },
};
