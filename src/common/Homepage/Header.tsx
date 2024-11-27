import Logo from '@/assets/images/logo.png';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed z-50 flex h-16 w-full items-center justify-between bg-white px-8 shadow-sm">
      <div>
        <img src={Logo} alt="Logo" className="size-10" />
      </div>
      <div>
        <div className="relative w-full">
          <Button className="absolute right-0 top-1/2 aspect-square h-full -translate-y-1/2 transform bg-[#094bf4] hover:bg-[#0635ad]">
            <Search className="text-white hover:cursor-pointer" />
          </Button>
          <Input
            placeholder="Tìm kiếm dự án..."
            className="h-10 w-[400px] border focus:border focus:border-[#094bf4]"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
