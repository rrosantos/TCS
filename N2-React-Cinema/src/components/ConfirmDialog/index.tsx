import { Modal } from "../Modal";
import { Button } from "../Button";

interface ConfirmDialogProps {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: "primary" | "danger" | "warning" | "success";
  loading?: boolean;
}

export const ConfirmDialog = ({
  show,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmVariant = "danger",
  loading = false,
}: ConfirmDialogProps) => {
  return (
    <Modal
      show={show}
      onClose={onClose}
      title={title}
      icon="question-circle"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="mb-0">{message}</p>
    </Modal>
  );
};
