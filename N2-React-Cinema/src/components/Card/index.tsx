import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  shadow?: boolean;
  border?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light";
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light"
    | "default";
  icon?: string;
  badge?: string | number;
  actions?: ReactNode;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
  scrollable?: boolean;
  maxHeight?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({
  children,
  className = "",
  shadow = false,
  border,
}: CardProps) => {
  const shadowClass = shadow ? "shadow-sm" : "";
  const borderClass = border ? `border-${border}` : "";

  return (
    <div className={`card ${shadowClass} ${borderClass} ${className}`.trim()}>
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = "",
  variant = "primary",
  icon,
  badge,
  actions,
}: CardHeaderProps) => {
  const variantClasses =
    variant === "default"
      ? ""
      : `bg-${variant} ${
          ["light", "warning"].includes(variant) ? "text-dark" : "text-white"
        }`;

  return (
    <div className={`card-header ${variantClasses} ${className}`.trim()}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          {icon && <i className={`bi bi-${icon} me-2`}></i>}
          {children}
        </h5>
        <div className="d-flex align-items-center gap-2">
          {badge !== undefined && (
            <span
              className={`badge ${
                variant === "default" ? "bg-primary" : "bg-light text-dark"
              }`}
            >
              {badge}
            </span>
          )}
          {actions}
        </div>
      </div>
    </div>
  );
};

export const CardBody = ({
  children,
  className = "",
  scrollable = false,
  maxHeight = "500px",
  onClick,
  style,
}: CardBodyProps) => {
  const scrollableStyles = scrollable
    ? { maxHeight, overflowY: "auto" as const }
    : {};
  const combinedStyles = { ...scrollableStyles, ...style };

  return (
    <div
      className={`card-body ${className}`.trim()}
      style={combinedStyles}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "" }: CardFooterProps) => {
  return <div className={`card-footer ${className}`.trim()}>{children}</div>;
};
