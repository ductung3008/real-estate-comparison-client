import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownSelectField } from '@/components/ui/DropdownSelectField';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useProjectStore from '@/stores/project.store';
import usePropertyTypeStore from '@/stores/property-type.store';
import { PropertyType } from '@/types/property-type.type';

interface PropertyTypeModalProps {
  modalProps?: {
    mode: 'read' | 'create' | 'edit';
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  propertyType?: PropertyType;
}

export const FormSchema = z.object({
  projectId: z.string({ required_error: 'Dự án không được để trống' }).optional(),
  numberOfBedroom: z.coerce.number({ required_error: 'Số phòng ngủ không được để trống' }).int(),
  minArea: z.coerce.number({ required_error: 'Diện tích tối thiểu không được để trống' }).int(),
  maxArea: z.coerce.number({ required_error: 'Diện tích tối đa không được để trống' }).int(),
  minPrice: z.coerce.number({ required_error: 'Giá tối thiểu không được để trống' }).int(),
  maxPrice: z.coerce.number({ required_error: 'Giá tối đa không được để trống' }).int(),
});

const PropertyTypeModal = ({ modalProps, propertyType }: PropertyTypeModalProps) => {
  const { projects } = useProjectStore();
  const { createPropertyType } = usePropertyTypeStore();

  const { mode, onSubmit } = modalProps || {
    mode: 'create',
    onSubmit: async (data: z.infer<typeof FormSchema>) => {
      try {
        await createPropertyType({ ...data });
      } catch (error) {
        console.error('Failed to create place', error);
      }
    },
  };

  const title = {
    read: 'Thông tin loại căn chung cư',
    create: 'Tạo loại căn chung cư mới',
    edit: 'Sửa thông tin loại căn chung cư',
  }[mode];

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(FormSchema),
    defaultValues: mode === 'create' ? undefined : propertyType,
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {mode !== 'read' && (
          <DialogDescription>Thay đổi thông tin loại căn chung cư tại đây. Nhấn Lưu để cập nhật.</DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {mode === 'create' && (
              <DropdownSelectField
                form={form}
                name="projectId"
                options={projects.map((p) => ({ label: p.name, value: p.id }))}
                label="Dự án"
                placeholder="Chọn dự án"
              />
            )}
            <FormField
              control={form.control}
              name="numberOfBedroom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại căn chung cư (Số phòng ngủ)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diện tích tối thiểu (m2)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Diện tích tối đa (m2)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá tối thiểu (VNĐ)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá tối đa (VNĐ)</FormLabel>
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

export default PropertyTypeModal;
