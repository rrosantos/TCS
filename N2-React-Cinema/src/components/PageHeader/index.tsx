import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  icon?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark";
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = ({
  title,
  icon,
  variant = "primary",
  subtitle,
  actions,
}: PageHeaderProps) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h2 className={`text-${variant} mb-0`}>
              {icon && <i className={`bi bi-${icon} me-2`}></i>}
              {title}
            </h2>
            {subtitle && <p className="text-muted mb-0 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="d-flex gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
};
