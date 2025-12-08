import { type ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  pill?: boolean;
  icon?: string;
  className?: string;
}

export const Badge = ({
  children,
  variant = "primary",
  pill = false,
  icon,
  className = "",
}: BadgeProps) => {
  const pillClass = pill ? "rounded-pill" : "";
  const textClass = ["light", "warning"].includes(variant) ? "text-dark" : "";

  return (
    <span
      className={`badge bg-${variant} ${pillClass} ${textClass} ${className}`.trim()}
    >
      {icon && <i className={`bi bi-${icon} me-1`}></i>}
      {children}
    </span>
  );
};
