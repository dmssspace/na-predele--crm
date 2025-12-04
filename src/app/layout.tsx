import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AntdRegistry } from "@ant-design/nextjs-registry";

import "@refinedev/antd/dist/reset.css";
import { RefineContext } from "./_refine_context";

export const metadata: Metadata = {
  title: 'CRM "На пределе"',
  description: 'Система управления спортивным клубом "На пределе"',
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = await getLocale();
  const messages = await getMessages();
  const theme = cookieStore.get("theme");
  const defaultMode = theme?.value === "dark" ? "dark" : "light";

  return (
    <html lang={locale}>
      <body>
        <AntdRegistry>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <RefineContext themeMode={defaultMode}>{children}</RefineContext>
          </NextIntlClientProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
