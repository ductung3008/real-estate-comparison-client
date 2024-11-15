import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/stores/auth.store';

const FormSchema = z.object({
  username: z.string({ required_error: 'Tên tài khoản không được để trống' }),
  password: z.string({ required_error: 'Mật khẩu không được để trống' }),
});

const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onSubmit',
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (data: z.infer<typeof FormSchema>) => {
    try {
      await login({ username: data.username, password: data.password });
      navigate('/dashboard');
    } catch (error) {
      form.setError('username', { message: 'Tên tài khoản hoặc mật khẩu không đúng' });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex h-screen w-screen items-center justify-center">
          <Card className="mx-auto max-w-sm">
            <CardHeader>
              <CardTitle className="text-2xl">Đăng nhập</CardTitle>
              <CardDescription>Điền tên tài khoản và mật khẩu để đăng nhập</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tên tài khoản</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <Button type="submit" className="mt-4 w-full">
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </Form>
  );
};

export default Login;
