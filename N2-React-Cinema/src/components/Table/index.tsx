import { type ReactNode } from "react";

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  striped?: boolean;
  hover?: boolean;
  responsive?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  striped = true,
  hover = true,
  responsive = true,
  emptyMessage = "Nenhum item encontrado.",
  emptyIcon = "inbox",
}: TableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="text-center text-muted p-4">
        <i className={`bi bi-${emptyIcon} display-4 d-block mb-3`}></i>
        <p className="mb-0">{emptyMessage}</p>
      </div>
    );
  }

  const tableClasses = [
    "table",
    striped ? "table-striped" : "",
    hover ? "table-hover" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <table className={tableClasses}>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} className={column.className}>
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={keyExtractor(item)}>
            {columns.map((column) => (
              <td key={column.key} className={column.className}>
                {column.render
                  ? column.render(item)
                  : String((item as Record<string, unknown>)[column.key] ?? "")}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  if (responsive) {
    return <div className="table-responsive">{content}</div>;
  }

  return content;
}
