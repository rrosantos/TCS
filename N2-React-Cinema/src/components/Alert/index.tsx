import { useEffect, useState, type ReactNode } from "react";

type AlertType =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary"
  | "secondary"
  | "dark"
  | "light";

interface AlertProps {
  message: string | ReactNode;
  type: AlertType;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
  icon?: string;
  title?: string;
  dismissible?: boolean;
}

const defaultIcons: Record<AlertType, string> = {
  success: "check-circle-fill",
  danger: "exclamation-triangle-fill",
  warning: "exclamation-circle-fill",
  info: "info-circle-fill",
  primary: "info-circle-fill",
  secondary: "info-circle-fill",
  dark: "info-circle-fill",
  light: "info-circle-fill",
};

export const Alert = ({
  message,
  type,
  onClose,
  autoClose = true,
  duration = 5000,
  icon,
  title,
  dismissible = true,
}: AlertProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  if (!visible) return null;

  const alertIcon = icon || defaultIcons[type];
  const dismissClass = dismissible ? "alert-dismissible" : "";

  return (
    <div
      className={`alert alert-${type} ${dismissClass} fade show d-flex align-items-center`}
      role="alert"
    >
      <i className={`bi bi-${alertIcon} me-2 flex-shrink-0`}></i>
      <div className="flex-grow-1">
        {title && <strong className="me-2">{title}</strong>}
        {message}
      </div>
      {dismissible && (
        <button
          type="button"
          className="btn-close"
          aria-label="Fechar"
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
        ></button>
      )}
    </div>
  );
};
