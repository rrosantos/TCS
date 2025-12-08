import { type InputHTMLAttributes, type ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helpText?: string | ReactNode;
  required?: boolean;
}

export const FormInput = ({
  label,
  error,
  helpText,
  required = false,
  id,
  className = "",
  ...props
}: FormInputProps) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="mb-3">
      <label
        htmlFor={inputId}
        className={`form-label ${required ? "required-field" : ""}`}
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`form-control ${
          error ? "is-invalid" : ""
        } ${className}`.trim()}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};
