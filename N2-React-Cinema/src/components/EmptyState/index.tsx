import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export const EmptyState = ({
  icon = "inbox",
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <div className="text-center text-muted py-5">
      <i className={`bi bi-${icon} display-1 mb-3 d-block`}></i>
      <h4>{title}</h4>
      {description && <p className="mb-3">{description}</p>}
      {action}
    </div>
  );
};
