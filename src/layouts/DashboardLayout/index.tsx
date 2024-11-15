import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import Logo from '@/assets/images/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import useAuthStore from '@/stores/auth.store';
import {
  Building2,
  ChevronRight,
  ChevronsUpDown,
  Cog,
  Github,
  HomeIcon,
  LayoutDashboard,
  LogOut,
  MapPin,
  User,
} from 'lucide-react';

const items = [
  { title: 'Tổng quan', icon: LayoutDashboard, href: '/dashboard', tooltip: 'Bảng điều khiển' },
  {
    title: 'Quản lý',
    icon: Cog,
    href: '#',
    tooltip: 'Quản lý',
    isActive: true,
    items: [
      { title: 'Dự án BĐS', icon: Building2, href: '/dashboard/projects', tooltip: 'Dự án bất động sản' },
      { title: 'Địa điểm', icon: MapPin, href: '/dashboard/places', tooltip: 'Địa điểm xung quanh' },
      { title: 'Người dùng', icon: User, href: '/dashboard/users', tooltip: 'Người dùng' },
    ],
  },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const currentPage = useLocation().pathname.split('/').pop();
  const pageName = currentPage !== 'dashboard' ? currentPage : '';

  const { user, logout } = useAuthStore();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-4">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={Logo} alt="Logo" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-2xl font-semibold">Onehousing</span>
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map(
                  (item) =>
                    !item.items && (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.tooltip} className="py-6">
                          <Link to={item.href}>
                            {item.icon && <item.icon />}
                            <span className="text-lg">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ),
                )}
                {items.map(
                  (item) =>
                    item.items && (
                      <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title} className="py-6">
                              {item.icon && <item.icon />}
                              <span className="text-lg">{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items?.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild className="py-6">
                                    <Link to={subItem.href}>
                                      {subItem.icon && <subItem.icon />}
                                      <span className="text-base">{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    ),
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}`} alt={user?.fullName} />
                      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.fullName}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="right"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${user?.fullName}`} alt={user?.fullName} />
                        <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.fullName}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/')}>
                      <HomeIcon />
                      Trang chủ
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => (window.open('https://github.com/ductung3008/real-estate-comparison'), '_blank')}
                    >
                      <Github />
                      Github
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" onClick={logout}>
                    <LogOut />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <main>
        <SidebarTrigger className="p-6 [&_svg]:size-6" />
      </main>
      <SidebarInset className="px-4 pb-4">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-base">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {pageName && <BreadcrumbSeparator className="hidden text-base md:block" />}
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-base first-letter:capitalize">{pageName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
