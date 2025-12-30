import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { ThemedLayout } from "@refinedev/antd";

import { Header } from "@components/header";
import { Title } from "@components/title";
import { authProviderServer } from "@providers/auth-provider/auth-provider.server";

export default async function Layout({ children }: PropsWithChildren) {
  const data = await getData();

  if (!data.authenticated) {
    return redirect(data?.redirectTo || "/login");
  }

  return (
    <ThemedLayout Header={Header} Title={Title}>
      {children}
    </ThemedLayout>
  );
}

async function getData() {
  const { authenticated, redirectTo } = await authProviderServer.check();

  return {
    authenticated,
    redirectTo,
  };
}
