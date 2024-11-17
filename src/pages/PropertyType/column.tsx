/* eslint-disable react-refresh/only-export-components */
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DataTableColumnHeader } from '@/components/ui/data-table/data-table-column-header';
import { DeleteDialog } from '@/components/ui/delete-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toBillions } from '@/lib/utils';
import usePropertyTypeStore from '@/stores/property-type.store';
import { PropertyType } from '@/types/property-type.type';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import PropertyTypeModal, { FormSchema } from './property-type-modal';

const PropertyTypeAction: React.FC<{ propertyType: PropertyType }> = ({ propertyType }) => {
  const { updatePropertyType, deletePropertyType } = usePropertyTypeStore();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updatePropertyType(propertyType.id, { ...data });
    } catch (error) {
      console.error('Failed to create property type', error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 data-[state=open]:bg-muted">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(propertyType.id)}>
            Sao chép Mã loại căn chung cư
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Sửa</DropdownMenuItem>
            </DialogTrigger>
            <PropertyTypeModal modalProps={{ mode: 'edit', onSubmit }} propertyType={propertyType} />
          </Dialog>
          <DeleteDialog title="Xoá" onConfirm={() => deletePropertyType(propertyType.id)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<PropertyType>[] = [
  {
    accessorKey: 'numberOfBedroom',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số phòng ngủ" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'minArea',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Diện tích tối thiểu (m2)" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'maxArea',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Diện tích tối đa (m2)" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'minPrice',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Giá tối thiểu (tỷ VNĐ)" />,
    cell: ({ row }) => {
      return toBillions(row.original.minPrice);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'maxPrice',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Giá tối đa (tỷ VNĐ)" />,
    cell: ({ row }) => {
      return toBillions(row.original.maxPrice);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'action',
    enableHiding: false,
    cell: ({ row }) => <PropertyTypeAction propertyType={row.original} />,
  },
];
