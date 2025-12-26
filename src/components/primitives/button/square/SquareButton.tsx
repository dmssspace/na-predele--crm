import { ReactNode } from "react";
import { Button, type ButtonProps } from "antd";

interface SquareButtonProps extends ButtonProps {
  sizePx?: number;
  label?: string;
  icon?: ReactNode;
}

const SquareButton: React.FC<SquareButtonProps> = ({
  sizePx = 148,
  label,
  icon,
  style,
  children,
  ...props
}) => {
  return (
    <Button
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 4,
        width: sizePx,
        height: sizePx,
        ...style,
      }}
      {...props}
    >
      {icon && <span style={{ fontSize: "24px", lineHeight: 1 }}>{icon}</span>}

      {label && (
        <span style={{ fontSize: "12px", lineHeight: 1 }}>{label}</span>
      )}

      {children}
    </Button>
  );
};

export default SquareButton;
