import { type SelectHTMLAttributes, type ReactNode } from "react";

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  error?: string;
  helpText?: string | ReactNode;
  required?: boolean;
  placeholder?: string;
}

export const FormSelect = ({
  label,
  options,
  error,
  helpText,
  required = false,
  placeholder = "Selecione",
  id,
  className = "",
  value,
  ...props
}: FormSelectProps) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="mb-3">
      <label
        htmlFor={selectId}
        className={`form-label ${required ? "required-field" : ""}`}
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`form-select ${
          error ? "is-invalid" : ""
        } ${className}`.trim()}
        value={value}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="invalid-feedback">{error}</div>}
      {helpText && !error && <div className="form-text">{helpText}</div>}
    </div>
  );
};
