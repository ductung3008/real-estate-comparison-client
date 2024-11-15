import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
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
import useUserStore from '@/stores/user.store';
import { User } from '@/types/user.type';
import UserModal, { FormSchema } from './user-modal';

// eslint-disable-next-line react-refresh/only-export-components
const UserActionCell: React.FC<{ user: User }> = ({ user }) => {
  const { updateUser, deleteUser } = useUserStore();

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data: z.infer<typeof FormSchema>) => {
    try {
      delete data.username;
      await updateUser(user.id, { ...data });
    } catch (error) {
      console.error('Failed to update user', error);
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
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
            Sao chép Mã người dùng
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Sửa</DropdownMenuItem>
            </DialogTrigger>
            <UserModal modalProps={{ mode: 'edit', onSubmit }} user={user} />
          </Dialog>
          <DeleteDialog title="Xoá" onConfirm={() => deleteUser(user.id)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'fullName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Họ tên" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên đăng nhập" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'action',
    enableHiding: false,
    cell: ({ row }) => <UserActionCell user={row.original} />,
  },
];
