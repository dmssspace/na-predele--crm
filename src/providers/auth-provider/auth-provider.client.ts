"use client";

import type { AuthProvider } from "@refinedev/core";
import Cookies from "js-cookie";

import { API_URL } from "@providers/constants";

export const authProviderClient: AuthProvider = {
  login: async ({ email, username, password, remember }) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (res.status < 200 || res.status > 299) {
        return {
          success: false,
          error: {
            name: "Ошибка авторизации",
            message: "Неправильная эл. почта или пароль",
          },
        };
      }

      // TODO: возможно стоит тут установить куки авторизации,
      // Cookies.set("session_id", JSON.stringify(user), {
      //   expires: 30, // 30 days
      //   path: "/",
      // });
      // TODO: которые прислал сервер на клиентскую часть?
      return {
        success: true,
        redirectTo: "/",
      };
    } catch (err) {
      // TODO: прологировать ошибку
      return {
        success: false,
        error: {
          name: "Ошибка сети",
          message:
            "Что-то пошло не так, мы уже в курсе проблемы, попробуй позже",
        },
      };
    }
  },
  logout: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status < 200 || res.status > 299) {
        return {
          success: false,
          error: {
            name: "Ошибка авторизации",
            message: "Невозможно выполнить выход",
          },
        };
      }

      // TODO: возможно нужно удалить куки авторизации с клиента?
      // Cookies.remove("auth", { path: "/" });

      return {
        success: true,
        redirectTo: "/login",
      };
    } catch (err) {
      // TODO: прологировать ошибку
      return {
        success: false,
        error: {
          name: "Ошибка сети",
          message:
            "Что-то пошло не так, мы уже в курсе проблемы, попробуй позже",
        },
      };
    }
  },
  check: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status < 200 || res.status > 299) {
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
        };
      }

      // TODO: возможно стоит сохранить состояние пользователя?

      return {
        authenticated: true,
      };
    } catch (err) {
      // TODO: прологировать ошибку
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
        error: {
          name: "Ошибка авторизации",
          message:
            "Что-то пошло не так, мы уже в курсе проблемы, попробуй позже",
        },
      };
    }
  },
  getPermissions: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status < 200 || res.status > 299) {
        return null;
      }

      const resJSON = await res.json();

      const role = resJSON.data.role;

      // TODO: возможно стоит сохранить состояние пользователя?

      return [role];
    } catch (err) {
      // TODO: прологировать ошибку
      return null;
    }
  },
  getIdentity: async () => {
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status < 200 || res.status > 299) {
        return null;
      }

      const resJSON = await res.json();

      return resJSON.data;
    } catch (err) {
      // TODO: прологировать ошибку
      return null;
    }
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
};
