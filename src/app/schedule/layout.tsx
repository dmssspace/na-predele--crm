"use client";

import React from "react";
import { ThemedLayout } from "@refinedev/antd";
import { Header } from "@/components/header";
import { Title } from "@/components/title";

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemedLayout Header={() => <Header sticky />} Title={Title}>
      {children}
    </ThemedLayout>
  );
}
