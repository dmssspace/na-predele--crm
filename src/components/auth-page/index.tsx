"use client";
import { AuthPage as AuthPageBase } from "@refinedev/antd";
import type { AuthPageProps } from "@refinedev/core";
import { Title } from "@components/title";

export const AuthPage = (props: AuthPageProps) => {
  // Используем больший размер логотипа для страницы логина (128px вместо 64px)
  const titleComponent = <Title collapsed={false} size={128} />;
  
  const commonProps = {
    title: titleComponent,
    ...props,
  };

  if (props.type === "login") {
    return (
      <AuthPageBase
        {...commonProps}
        type="login"
        forgotPasswordLink={false}
        registerLink={false}
        rememberMe={false}
      />
    );
  }

  return <AuthPageBase {...commonProps} />;
};
