/* eslint-disable react-refresh/only-export-components */
// eslint-disable-next-line react-refresh/only-export-components
import { SubmitHandler } from 'react-hook-form';
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
import { toMapString, toPriceRange } from '@/lib/utils';
import useProjectStore from '@/stores/project.store';
import { Project } from '@/types/project.type';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import ProjectModal, { FormSchema, handleFormData } from './project-modal';

const ProjectActionCell: React.FC<{ project: Project }> = ({ project }) => {
  const { updateProject, deleteProject } = useProjectStore();

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data: z.infer<typeof FormSchema>) => {
    try {
      const formData = await handleFormData(data);
      await updateProject(project.id, { ...formData });
    } catch (error) {
      console.error('Failed to update project', error);
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(project.id)}>
            Sao chép Mã dự án
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => window.open(toMapString(project.latitude, project.longitude))}>
            Mở trong Google Map
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Sửa</DropdownMenuItem>
            </DialogTrigger>
            <ProjectModal modalProps={{ mode: 'edit', onSubmit }} project={project} />
          </Dialog>
          <DeleteDialog title="Xoá" onConfirm={() => deleteProject(project.id)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'masterPlanUrl',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ảnh dự án" />,
    cell: ({ row }) => {
      const project = row.original;
      return (
        <img
          src={project.masterPlanUrl ? project.masterPlanUrl : 'https://placehold.co/250x150?text=404'}
          alt="Ảnh dự án"
          className="h-[150px] w-[250px] rounded-md object-cover"
        />
      );
    },
    enableSorting: false,
    enableGlobalFilter: false,
    size: 250,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'address',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Địa chỉ" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'developerName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Chủ đầu tư" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'totalArea',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Quy mô" />,
    cell: ({ row }) => {
      const project = row.original;
      return project.totalArea === 0 ? '- -' : `${project.totalArea} ha`;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'totalProperty',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Số căn hộ" />,
    cell: ({ row }) => {
      const project = row.original;
      return project.totalProperty === 0 ? '- -' : `${project.totalProperty} căn`;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'price',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Giá" />,
    cell: ({ row }) => {
      const project = row.original;
      const priceRange = toPriceRange(project.minSellingPrice, project.maxSellingPrice);
      return priceRange === '0' ? '- -' : `${priceRange} tỷ`;
    },
    sortingFn: (rowA, rowB) => {
      return rowA.original.minSellingPrice - rowB.original.minSellingPrice;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'action',
    enableHiding: false,
    cell: ({ row }) => <ProjectActionCell project={row.original} />,
  },
];
