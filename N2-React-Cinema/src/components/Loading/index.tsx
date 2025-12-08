interface LoadingProps {
  text?: string;
  variant?:
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "warning"
    | "info"
    | "dark"
    | "light";
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

export const Loading = ({
  text = "Carregando...",
  variant = "primary",
  size = "md",
  fullPage = false,
}: LoadingProps) => {
  const sizeClass = size === "sm" ? "spinner-border-sm" : "";
  const spinnerSize = size === "lg" ? { width: "3rem", height: "3rem" } : {};

  const content = (
    <div className="text-center p-3">
      <div
        className={`spinner-border text-${variant} ${sizeClass}`}
        role="status"
        style={spinnerSize}
      >
        <span className="visually-hidden">{text}</span>
      </div>
      {text && <p className={`text-${variant} mt-2 mb-0`}>{text}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        {content}
      </div>
    );
  }

  return content;
};
