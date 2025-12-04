"use server";

import { cookies } from "next/headers";

import { DEFAULT_LOCALE, I18N_COOKIE_NAME } from "./config";

export async function getUserLocale() {
  return (await cookies()).get(I18N_COOKIE_NAME)?.value || DEFAULT_LOCALE;
}

export async function setUserLocale(locale: string) {
  (await cookies()).set(I18N_COOKIE_NAME, locale);
}

export default async function getRequestConfig(): Promise<{
  locale: string;
  messages: any;
}> {
  const locale = await getUserLocale();

  return {
    locale,
    messages: (await import(`../../../public/locales/${locale}.json`)).default,
  };
}
