import { type ReactNode, useEffect } from "react";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: ReactNode;
  footer?: ReactNode;
  closeOnBackdrop?: boolean;
}

export const Modal = ({
  show,
  onClose,
  title,
  icon,
  size = "md",
  children,
  footer,
  closeOnBackdrop = true,
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && show) {
        onClose();
      }
    };

    if (show) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [show, onClose]);

  if (!show) return null;

  const sizeClass =
    size === "sm"
      ? "modal-sm"
      : size === "lg"
      ? "modal-lg"
      : size === "xl"
      ? "modal-xl"
      : "";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        onClick={handleBackdropClick}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className={`modal-dialog modal-dialog-centered ${sizeClass}`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {icon && <i className={`bi bi-${icon} me-2`}></i>}
                {title}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Fechar"
              ></button>
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>
    </>
  );
};
