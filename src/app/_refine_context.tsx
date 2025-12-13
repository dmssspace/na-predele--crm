"use client";

import { PropsWithChildren, Suspense } from "react";

import { useNotificationProvider } from "@refinedev/antd";
import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { I18nProvider } from "@refinedev/core";

import { ColorModeContextProvider } from "@contexts/color-mode";
import { DevtoolsProvider } from "@providers/devtools";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@lib/i18n/i18n";
import {
  FileImageOutlined,
  IdcardOutlined,
  ReadOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagOutlined,
  UserOutlined,
} from "@ant-design/icons";

type Props = {
  themeMode?: string;
};

export const RefineContext = ({
  themeMode,
  children,
}: PropsWithChildren<Props>) => {
  const t = useTranslations();

  const i18nProvider: I18nProvider = {
    translate: (key: string, options: any) => t(key, options),
    getLocale: useLocale,
    changeLocale: setUserLocale,
  };

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <RefineKbarProvider>
        <ColorModeContextProvider defaultMode={themeMode}>
          <DevtoolsProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider}
              authProvider={authProviderClient}
              resources={[
                {
                  name: "customers",
                  list: "/customers",
                  create: "/customers/create",
                  edit: "/customers/edit/:id",
                  show: "/customers/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Клиенты",
                    icon: <UserOutlined />,
                  },
                },
                {
                  name: "trainers",
                  list: "/trainers",
                  create: "/trainers/create",
                  edit: "/trainers/edit/:id",
                  show: "/trainers/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Тренеры",
                    icon: <IdcardOutlined />,
                  },
                },
                {
                  name: "ticket-plans",
                  list: "/ticket-plans",
                  edit: "/ticket-plans/edit/:id",
                  show: "/ticket-plans/show/:id",
                  meta: {
                    canDelete: true,
                    parent: "tickets",
                    label: "Настройки",
                    icon: <SettingOutlined />,
                  },
                },
                {
                  name: "tickets",
                  meta: {
                    label: "Абонементы",
                    icon: <FileImageOutlined />,
                  },
                },
                {
                  name: "blog-posts",
                  list: "/blog-posts",
                  create: "/blog-posts/create",
                  edit: "/blog-posts/edit/:id",
                  show: "/blog-posts/show/:id",
                  meta: {
                    canDelete: true,
                    parent: "blog",
                    label: "Посты",
                    icon: <ReadOutlined />,
                  },
                },
                {
                  name: "blog-categories",
                  list: "/blog-categories",
                  create: "/blog-categories/create",
                  edit: "/blog-categories/edit/:id",
                  show: "/blog-categories/show/:id",
                  meta: {
                    canDelete: true,
                    parent: "blog",
                    label: "Категории",
                    icon: <TagOutlined />,
                  },
                },
                {
                  name: "blog",
                  meta: {
                    label: "Блог",
                    icon: <ReadOutlined />,
                  },
                },
                {
                  name: "shop-products",
                  list: "/shop-products",
                  create: "/shop-products/create",
                  edit: "/shop-products/edit/:id",
                  show: "/shop-products/show/:id",
                  meta: {
                    canDelete: true,
                    parent: "shop",
                    label: "Товары",
                    icon: <ShoppingOutlined />,
                  },
                },
                {
                  name: "shop",
                  meta: {
                    label: "Магазин",
                    icon: <ShoppingOutlined />,
                  },
                },
                {
                  name: "media",
                  list: "/media",
                  create: "/media/upload",
                  edit: "/media/edit/:id",
                  show: "/media/show/:id",
                  meta: {
                    canDelete: true,
                    label: "Медиа",
                    icon: <FileImageOutlined />,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "OAyqmG-mrpQv1-CAeCMY",
              }}
              i18nProvider={i18nProvider}
            >
              {children}
              <RefineKbar />
            </Refine>
          </DevtoolsProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </Suspense>
  );
};
