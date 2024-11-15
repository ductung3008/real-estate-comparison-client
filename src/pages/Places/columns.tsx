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
import { toCoordinateString, toMapString } from '@/lib/utils';
import { Place, place_categories } from '@/types/place.type';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import PlaceModal, { FormSchema } from './place-modal';
import usePlaceStore from '@/stores/place.store';

const PlaceActionCell: React.FC<{ place: Place }> = ({ place }) => {
  const { updatePlace, deletePlace } = usePlaceStore();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updatePlace(place.id, { ...data });
    } catch (error) {
      console.error('Failed to create place', error);
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(place.id)}>
            Sao chép Mã địa điểm
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => window.open(toMapString(place.latitude, place.longitude))}>
            Mở trong Google Map
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Sửa</DropdownMenuItem>
            </DialogTrigger>
            <PlaceModal modalProps={{ mode: 'edit', onSubmit }} place={place} />
          </Dialog>
          <DeleteDialog title="Xoá" onConfirm={() => deletePlace(place.id)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<Place>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Loại" />,
    cell: ({ row }) => {
      const place = row.original;
      return place.category ? place_categories.find((item) => item.value === place.category)?.label : '-';
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'coordinates',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Toạ độ" />,
    cell: ({ row }) => {
      const place = row.original;
      return toCoordinateString(place.latitude, place.longitude);
    },
    enableSorting: false,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'distance',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Khoảng cách (km)" />,
    cell: ({ row }) => {
      const place = row.original;
      return place.distance ?? '-';
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'rating',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Đánh giá" />,
    cell: ({ row }) => {
      const place = row.original;
      return place.rating ?? '-';
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'action',
    enableHiding: false,
    cell: ({ row }) => <PlaceActionCell place={row.original} />,
  },
];
