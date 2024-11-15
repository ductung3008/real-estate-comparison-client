import { ColumnDef } from '@tanstack/react-table';
import { DataTableToolbar } from '@/components/ui/data-table/data-table-toolbar';
import { DataTable } from '@/components/ui/data-table/data-table';

interface TablePageProps<T> {
  title: string;
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Modal: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalProps?: { mode: 'create' | 'edit' | 'read'; onSubmit: (data: any) => void };
}

export default function TablePage<T>({
  title,
  data,
  columns,
  loading,
  children,
  Modal,
  modalProps,
}: TablePageProps<T>) {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold tracking-tight">{title}</h2>
      <DataTable
        data={data}
        columns={columns}
        toolbar={(table) => <DataTableToolbar table={table} Modal={Modal} modalProps={modalProps} />}
        loading={loading}
        children={children}
      />
    </div>
  );
}
