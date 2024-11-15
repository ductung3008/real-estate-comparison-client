import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownSelectField } from '@/components/ui/DropdownSelectField';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import usePlaceStore from '@/stores/place.store';
import useProjectStore from '@/stores/project.store';
import { Place, place_categories, PlaceCategories } from '@/types/place.type';

interface PlaceModalProps {
  modalProps?: {
    mode: 'read' | 'create' | 'edit';
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  place?: Place;
}

export const FormSchema = z.object({
  project_id: z.string({ required_error: 'Dự án không được để trống' }).optional(),
  name: z.string({ required_error: 'Tên địa điểm không được để trống' }),
  latitude: z.coerce.number({ required_error: 'Vĩ độ không được để trống' }),
  longitude: z.coerce.number({ required_error: 'Kinh độ không được để trống' }),
  distance: z.coerce.number({ required_error: 'Khoảng cách không được để trống' }),
  rating: z.coerce.number({ required_error: 'Đánh giá không được để trống' }),
  category: z.nativeEnum(PlaceCategories, { required_error: 'Loại địa điểm không được để trống' }),
});

const PlaceModal = ({ modalProps, place }: PlaceModalProps) => {
  const { createPlace } = usePlaceStore();
  const { projects } = useProjectStore();

  const { mode, onSubmit } = modalProps || {
    mode: 'create',
    onSubmit: async (data: z.infer<typeof FormSchema>) => {
      try {
        await createPlace({ ...data });
      } catch (error) {
        console.error('Failed to create place', error);
      }
    },
  };

  const title = {
    read: 'Thông tin địa điểm',
    create: 'Tạo địa điểm mới',
    edit: 'Sửa thông tin địa điểm',
  }[mode];

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(FormSchema),
    defaultValues: mode === 'create' ? undefined : place,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {mode !== 'read' && (
          <DialogDescription>Thay đổi thông tin địa điểm tại đây. Nhấn Lưu để cập nhật.</DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {mode === 'create' && (
              <DropdownSelectField
                form={form}
                name="project_id"
                options={projects.map((p) => ({ label: p.name, value: p.id }))}
                label="Dự án"
                placeholder="Chọn dự án"
              />
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên địa điểm</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DropdownSelectField
              form={form}
              name="category"
              options={place_categories}
              label="Loại địa điểm"
              placeholder="Chọn loại địa điểm"
            />
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vĩ độ</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kinh độ</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="distance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Khoảng cách (km)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Đánh giá</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {mode !== 'read' && (
            <DialogFooter>
              <Button type="submit" className="mt-2">
                {form.formState.isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </DialogFooter>
          )}
        </form>
      </Form>
    </DialogContent>
  );
};

export default PlaceModal;
