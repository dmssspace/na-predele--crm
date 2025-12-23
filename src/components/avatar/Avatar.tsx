import React from "react";
import { Avatar as AntAvatar } from "antd";
import type { AvatarProps as AntAvatarProps } from "antd";

interface AvatarProps extends Omit<AntAvatarProps, "src"> {
  src?: string | null;
  fullName?: string;
  size?: number | "large" | "small" | "default";
}

/**
 * Компонент аватара с поддержкой инициалов.
 * Если аватар не указан, отображает инициалы имени и фамилии на оранжевом фоне.
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  fullName,
  size = "default",
  ...props
}) => {
  const getInitials = (name?: string): string => {
    if (!name) return "?";

    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0][0]?.toUpperCase() || "?";
  };

  const initials = getInitials(fullName);

  if (src) {
    return <AntAvatar src={src} size={size} alt={fullName} {...props} />;
  }

  return (
    <AntAvatar
      size={size}
      style={{
        backgroundColor: "#ff8c00",
        color: "#ffffff",
        fontWeight: 500,
        fontSize: size === "large" ? 24 : size === "small" ? 12 : 16,
        userSelect: "none",
      }}
      {...props}
    >
      {initials}
    </AntAvatar>
  );
};
