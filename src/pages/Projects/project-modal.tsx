/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { nullable, z } from 'zod';

import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { axiosFormData } from '@/services/axios';
import useProjectStore from '@/stores/project.store';
import { Project } from '@/types/project.type';

interface ProjectModalProps {
  modalProps?: {
    mode: 'read' | 'create' | 'edit';
    onSubmit: (data: z.infer<typeof FormSchema>) => void;
  };
  project?: Project;
}

export const FormSchema = z.object({
  code: z.string({ required_error: 'Mã không được để trống' }),
  name: z.string({ required_error: 'Tên không được để trống' }),
  address: z.string({ required_error: 'Địa chỉ không được để trống' }),
  developerName: z.string({ required_error: 'Chủ đầu tư không được để trống' }),
  masterPlanUrl: z.instanceof(File).optional(),
  infrastructureMapUrl: z.instanceof(File).optional(),
  constructionStartDateFrom: nullable(z.string()).optional(),
  handoverDate: nullable(z.string()).optional(),
  rank: z.string().optional().default(''),
  totalArea: z.coerce.number().optional().default(0),
  ctsnDens: z.coerce.number().optional().default(0),
  totalProperty: z.coerce.number().optional().default(0),
  minSellingPrice: z.coerce.number().optional().default(0),
  maxSellingPrice: z.coerce.number().optional().default(0),
  minUnitPrice: z.coerce.number().optional().default(0),
  maxUnitPrice: z.coerce.number().optional().default(0),
  blocks: z.coerce.number().optional().default(0),
  numberEle: z.coerce.number().optional().default(0),
  numberLivingFloor: z.coerce.number().optional().default(0),
  numberBasement: z.coerce.number().optional().default(0),
  minPropPerFloor: z.coerce.number().optional().default(0),
  maxPropPerFloor: z.coerce.number().optional().default(0),
  bikeParkingMonthly: z.coerce.number().optional().default(0),
  carParkingMonthly: z.coerce.number().optional().default(0),
  latitude: z.coerce.number({ required_error: 'Vĩ độ không được để trống' }),
  longitude: z.coerce.number({ required_error: 'Kinh độ không được để trống' }),
  createdBy: z.string().optional(),
  createdAt: z.string().optional(),
  updateAt: z.string().optional(),
});

export const handleFormData = async (data: z.infer<typeof FormSchema>) => {
  try {
    let masterImage = undefined;
    let mapImage = undefined;
    if (data.masterPlanUrl instanceof File) {
      const formData = new FormData();
      formData.append('image', data.masterPlanUrl);
      const response = await axiosFormData.post('/upload', formData);
      masterImage = response.data.url;
    }

    if (data.infrastructureMapUrl instanceof File) {
      const formData = new FormData();
      formData.append('image', data.infrastructureMapUrl);
      const response = await axiosFormData.post('/upload', formData);
      mapImage = response.data.url;
    }

    return { ...data, masterPlanUrl: masterImage, infrastructureMapUrl: mapImage };
  } catch (error) {
    console.error('Failed to create project', error);
  }
};

const ProjectModal = ({ modalProps, project }: ProjectModalProps) => {
  const { createProject } = useProjectStore();

  const { mode, onSubmit } = modalProps || {
    mode: 'create',
    onSubmit: async (data: z.infer<typeof FormSchema>) => {
      try {
        const formData = await handleFormData(data);
        await createProject({ ...formData });
      } catch (error) {
        console.error('Failed to create project', error);
      }
    },
  };

  const title = {
    read: 'Thông tin dự án bất động sản',
    create: 'Tạo dự án bất động sản mới',
    edit: 'Sửa thông tin dự án bất động sản',
  }[mode];

  const [imageUrl, setImageUrl] = useState<string>(project?.masterPlanUrl || 'https://placehold.co/250x150?text=404');
  const [infrastructureMapUrl, setInfrastructureMapUrl] = useState<string>(
    project?.infrastructureMapUrl || 'https://placehold.co/250x150?text=404',
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      onChange(file);
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInfrastructureMapChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      onChange(file);
      reader.onload = () => {
        setInfrastructureMapUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onTouched',
    resolver: zodResolver(FormSchema),
    defaultValues:
      mode === 'create' ? undefined : { ...project, masterPlanUrl: undefined, infrastructureMapUrl: undefined },
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        {mode !== 'read' && (
          <DialogDescription>Thay đổi thông tin dự án bất động sản tại đây. Nhấn Lưu để cập nhật.</DialogDescription>
        )}
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid max-h-[500px] gap-4 overflow-y-scroll py-4 pl-1 pr-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="developerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chủ đầu tư</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
              name="masterPlanUrl"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Ảnh dự án</FormLabel>
                  {mode !== 'read' && (
                    <FormControl>
                      <Input {...field} type="file" onChange={(e) => handleImageChange(e, onChange)} accept="image/*" />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {imageUrl && <img src={imageUrl} alt="Ảnh dự án" className="aspect-video w-full rounded-md object-cover" />}
            <FormField
              control={form.control}
              name="infrastructureMapUrl"
              render={({ field: { onChange, value, ...field } }) => (
                <FormItem>
                  <FormLabel>Bản đồ hạ tầng</FormLabel>
                  {mode !== 'read' && (
                    <FormControl>
                      <Input {...field} type="file" onChange={(e) => handleInfrastructureMapChange(e, onChange)} />
                    </FormControl>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            {infrastructureMapUrl && (
              <img
                src={infrastructureMapUrl}
                alt="Bản đồ hạ tầng"
                className="aspect-video w-full rounded-md object-cover"
              />
            )}
            <FormField
              control={form.control}
              name="constructionStartDateFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời điểm khởi công</FormLabel>
                  <br />
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="handoverDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Thời điểm bàn giao</FormLabel>
                  <br />
                  <FormControl>
                    <DatePicker value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rank"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phân khúc</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quy mô</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ctsnDens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật độ xây dựng</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="totalProperty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tổng số căn</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minSellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá bán thấp nhất</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxSellingPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá bán cao nhất</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minUnitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giá bán theo m<sup>2</sup> thấp nhất
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxUnitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Giá bán theo m<sup>2</sup> cao nhất
                  </FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="blocks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tòa</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberEle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số thang máy/tòa</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberLivingFloor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tầng nổi</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberBasement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số tầng hầm</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minPropPerFloor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số căn/tầng ít nhất</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxPropPerFloor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số căn/tầng nhiều nhất</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bikeParkingMonthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phí đỗ xe máy/tháng</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carParkingMonthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phí đỗ ô tô/tháng</FormLabel>
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

export default ProjectModal;
