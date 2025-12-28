"use client";

import { PropsWithChildren, Suspense } from "react";

import { useNotificationProvider, ThemedLayout } from "@refinedev/antd";
import { Refine, useCustom } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider from "@refinedev/nextjs-router";
import { I18nProvider } from "@refinedev/core";
import { Header } from "@components/header";
import { Title } from "@components/title";
import { Badge } from "antd";

import { ColorModeContextProvider } from "@contexts/color-mode";
import { authProviderClient } from "@providers/auth-provider/auth-provider.client";
import { dataProvider } from "@providers/data-provider";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@lib/i18n/i18n";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  FileImageOutlined,
  IdcardOutlined,
  PhoneOutlined,
  ReadOutlined,
  SettingOutlined,
  ShoppingOutlined,
  TagOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

type Props = {
  themeMode?: string;
};

const CallbackIcon = () => {
  const {
    query: { data },
  } = useCustom({
    url: "/callback/new/count",
    method: "get",
    queryOptions: {
      refetchInterval: 30000,
    },
  });

  const count = data?.data?.data || 0;

  return (
    <Badge
      count={count}
      size="small"
      showZero={false}
      style={{ lineHeight: 1 }}
    >
      <PhoneOutlined style={{ fontSize: 16 }} />
    </Badge>
  );
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
          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            authProvider={authProviderClient}
            resources={[
              {
                name: "dashboard",
                list: "/dashboard",
                meta: {
                  canDelete: false,
                  label: "Главная",
                  icon: <SettingOutlined />,
                },
              },
              {
                name: "callback",
                identifier: "callback-requests",
                list: "/callback",
                meta: {
                  canDelete: false,
                  label: "Заявки",
                  icon: <PhoneOutlined />,
                },
              },
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
                  icon: <TeamOutlined />,
                },
              },
              {
                name: "schedule",
                meta: {
                  label: "Расписание",
                  icon: <CalendarOutlined />,
                },
              },
              {
                name: "schedule",
                identifier: "schedule/calendar",
                list: "/schedule",
                meta: {
                  canDelete: false,
                  parent: "schedule",
                  label: "Календарь",
                  icon: <CalendarOutlined />,
                },
              },
              {
                name: "schedule/bookings",
                list: "/schedule/bookings",
                meta: {
                  canDelete: false,
                  parent: "schedule",
                  label: "Бронирования",
                  icon: <IdcardOutlined />,
                },
              },
              {
                name: "schedule/events",
                list: "/schedule/events",
                create: "/schedule/events/create/recurring",
                meta: {
                  canDelete: false,
                  parent: "schedule",
                  label: "События",
                  icon: <SettingOutlined />,
                },
              },
              {
                name: "schedule/visits",
                list: "/schedule/visits",
                meta: {
                  canDelete: false,
                  parent: "schedule",
                  label: "История визитов",
                  icon: <ClockCircleOutlined />,
                },
              },
              {
                name: "tickets",
                meta: {
                  label: "Абонементы",
                  icon: <IdcardOutlined />,
                },
              },
              {
                name: "tickets",
                identifier: "tickets/tickets",
                list: "/tickets",
                create: "/tickets/create",
                edit: "/tickets/edit/:id",
                show: "/tickets/show/:id",
                meta: {
                  canDelete: true,
                  parent: "tickets",
                  label: "Абонементы",
                  icon: <IdcardOutlined />,
                },
              },
              {
                name: "tickets/plans",
                list: "/tickets/plans",
                edit: "/tickets/plans/edit/:id",
                show: "/tickets/plans/show/:id",
                meta: {
                  canDelete: false,
                  parent: "tickets",
                  label: "Управление тарифами",
                  icon: <SettingOutlined />,
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
                name: "blog",
                identifier: "blog/posts",
                list: "/blog",
                create: "/blog/create",
                edit: "/blog/edit/:id",
                show: "/blog/show/:id",
                meta: {
                  canDelete: true,
                  parent: "blog",
                  label: "Посты",
                  icon: <ReadOutlined />,
                },
              },
              {
                name: "blog/categories",
                list: "/blog/categories",
                create: "/blog/categories/create",
                edit: "/blog/categories/edit/:id",
                show: "/blog/categories/show/:id",
                meta: {
                  canDelete: true,
                  parent: "blog",
                  label: "Категории",
                  icon: <TagOutlined />,
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
                name: "shop/products",
                list: "/shop/products",
                create: "/shop/products/create",
                edit: "/shop/products/edit/:id",
                show: "/shop/products/show/:id",
                meta: {
                  canDelete: true,
                  parent: "shop",
                  label: "Товары",
                  icon: <ShoppingOutlined />,
                },
              },
              {
                name: "administration",
                meta: {
                  label: "Администрирование",
                  icon: <SettingOutlined />,
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
                  parent: "administration",
                },
              },
              {
                name: "schedule/availability",
                list: "/schedule/availability",
                meta: {
                  canDelete: false,
                  label: "Расписание зала",
                  icon: <ClockCircleOutlined />,
                  parent: "administration",
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
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </Suspense>
  );
};
