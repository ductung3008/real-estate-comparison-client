import { Button } from '@/components/ui/button';
import { DataTableViewOptions } from '@/components/ui/data-table/data-table-view-options';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Table } from '@tanstack/react-table';
import { ArrowUpDown, Plus, Search } from 'lucide-react';

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Modal: React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  modalProps?: { mode: 'read' | 'create' | 'edit'; onSubmit: (data: any) => void };
}

export function DataTableToolbar<TData>({ table, Modal, modalProps }: DataTableToolbarProps<TData>) {
  return (
    <div className="my-4 flex items-center justify-between">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" size="sm">
            <Plus />
            Tạo
          </Button>
        </DialogTrigger>
        <Modal modalProps={modalProps} />
      </Dialog>
      <div className="flex gap-2">
        <div className="flex items-center space-x-2">
          <div className="relative w-full">
            <Search className="absolute right-2 top-1/2 size-5 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder="Tìm kiếm..."
              value={table.getState().globalFilter}
              onChange={(e) => table.setGlobalFilter(String(e.target.value))}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto hidden h-8 lg:flex"
              onClick={() => {
                table.setSorting([]);
              }}
            >
              <ArrowUpDown />
              Xoá bộ lọc
            </Button>
          </div>
        </div>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
