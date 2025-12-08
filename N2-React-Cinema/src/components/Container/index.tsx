import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  fluid?: boolean;
}

export const Container = ({
  children,
  className = "",
  fluid = false,
}: ContainerProps) => {
  const containerClass = fluid ? "container-fluid" : "container";

  return (
    <div className={`${containerClass} mt-4 ${className}`.trim()}>
      {children}
    </div>
  );
};
