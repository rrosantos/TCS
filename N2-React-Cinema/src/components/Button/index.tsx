import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark"
  | "light"
  | "cinema"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-danger"
  | "outline-warning"
  | "outline-info";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  loading = false,
  fullWidth = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  const sizeClass = size === "sm" ? "btn-sm" : size === "lg" ? "btn-lg" : "";
  const variantClass = variant === "cinema" ? "btn-cinema" : `btn-${variant}`;
  const widthClass = fullWidth ? "w-100" : "";

  const renderIcon = () => {
    if (loading) {
      return (
        <span
          className="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      );
    }
    if (icon) {
      return (
        <i
          className={`bi bi-${icon} ${
            iconPosition === "left" ? "me-2" : "ms-2"
          }`}
        ></i>
      );
    }
    return null;
  };

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${widthClass} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};
