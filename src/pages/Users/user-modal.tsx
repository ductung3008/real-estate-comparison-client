import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useUserStore from '@/stores/user.store';
import { User } from '@/types/user.type';

interface UserModalProps {
  modalProps?: {
    mode: 'read' | 'create' | 'edit';
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  user?: User;
}

export const FormSchema = z.object({
  fullName: z.string({ required_error: 'Họ tên không được để trống' }),
  username: z.string({ required_error: 'Tên đăng nhập không được để trống' }),
  email: z.string({ required_error: 'Email không được để trống' }),
  password: z.string({ required_error: 'Mật khẩu không được để trống' }).optional(),
});

const UserModal = ({ modalProps, user }: UserModalProps) => {
  const { createUser } = useUserStore();

  const { mode, onSubmit } = modalProps || {
    mode: 'create',
    onSubmit: async (data: z.infer<typeof FormSchema>) => {
      try {
        await createUser({ ...data });
      } catch (error) {
        console.error('Failed to create user', error);
      }
    },
  };

  const title = {
    read: 'Thông tin người dùng',
    create: 'Tạo người dùng mới',
    edit: 'Sửa thông tin người dùng',
  }[mode];

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'all',
    resolver: zodResolver(FormSchema),
    defaultValues: user,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {mode !== 'read' && (
          <DialogDescription>Thay đổi thông tin người dùng tại đây. Nhấn Lưu để cập nhật.</DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đăng nhập</FormLabel>
                  <FormControl>{mode === 'create' ? <Input {...field} /> : <Input {...field} disabled />}</FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {mode === 'create' && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {mode !== 'read' && (
            <DialogFooter>
              <Button type="submit" className="mt-2">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          )}
        </form>
      </Form>
    </DialogContent>
  );
};

export default UserModal;
