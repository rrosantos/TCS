import { type TextareaHTMLAttributes } from "react";

interface FormTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
}

export const FormTextarea = ({
  label,
  error,
  helpText,
  required = false,
  showCharCount = false,
  maxLength,
  id,
  className = "",
  value,
  ...props
}: FormTextareaProps) => {
  const textareaId =
    id || `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const currentLength = typeof value === "string" ? value.length : 0;

  return (
    <div className="mb-3">
      <label
        htmlFor={textareaId}
        className={`form-label ${required ? "required-field" : ""}`}
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`form-control ${
          error ? "is-invalid" : ""
        } ${className}`.trim()}
        value={value}
        maxLength={maxLength}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {showCharCount && maxLength && (
        <div className="form-text">
          {currentLength}/{maxLength} caracteres
        </div>
      )}
      {helpText && !error && !showCharCount && (
        <div className="form-text">{helpText}</div>
      )}
    </div>
  );
};
