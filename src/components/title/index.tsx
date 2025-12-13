"use client";

import React from "react";
import { useLink } from "@refinedev/core";
import { Typography, theme } from "antd";
import Image from "next/image";

const { useToken } = theme;

type TitleProps = {
  collapsed: boolean;
  size?: number;
};

export const Title: React.FC<TitleProps> = ({ collapsed, size = 64 }) => {
  const { token } = useToken();
  const Link = useLink();

  return (
    <Link
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        src="/logo.webp"
        alt="На пределе"
        width={size}
        height={size}
        style={{
          objectFit: "contain",
        }}
      />
    </Link>
  );
};
