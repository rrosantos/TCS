type StatCardVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "dark";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
  variant?: StatCardVariant;
  subtitle?: string;
}

export const StatCard = ({
  title,
  value,
  icon,
  variant = "primary",
  subtitle,
}: StatCardProps) => {
  return (
    <div className={`card bg-${variant} text-white h-100`}>
      <div className="card-body text-center">
        {icon && <i className={`bi bi-${icon} display-4`}></i>}
        <h3 className="mt-2">{value}</h3>
        <p className="mb-0">{title}</p>
        {subtitle && <small className="opacity-75">{subtitle}</small>}
      </div>
    </div>
  );
};
