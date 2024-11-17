import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn, toSentenceCase } from '@/lib/utils';
import { Table } from '@tanstack/react-table';
import { Check, ChevronsUpDown, Settings2 } from 'lucide-react';

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          aria-label="Toggle columns"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          size="sm"
          className="ml-auto hidden h-8 gap-2 lg:flex"
        >
          <Settings2 className="size-4" />
          Hiển thị
          <ChevronsUpDown className="ml-auto size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-0">
        <Command>
          <CommandInput placeholder="Tìm kiếm cột..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy cột phù hợp.</CommandEmpty>
            <CommandGroup>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map((column) => {
                  const itemName = column.columnDef.header?.toString().match(/title: "([^"]+)"/)?.[1] || toSentenceCase(column.id);

                  return (
                    <CommandItem key={column.id} onSelect={() => column.toggleVisibility(!column.getIsVisible())}>
                      <span className="truncate">{itemName}</span>
                      <Check
                        className={cn('ml-auto size-4 shrink-0', column.getIsVisible() ? 'opacity-100' : 'opacity-0')}
                      />
                    </CommandItem>
                  );
                })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
    //       <Settings2 />
    //       View
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent align="end" className="w-[150px]">
    //     <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     {table
    //       .getAllColumns()
    //       .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
    //       .map((column) => {
    //         return (
    //           <DropdownMenuCheckboxItem
    //             key={column.id}
    //             className="capitalize"
    //             checked={column.getIsVisible()}
    //             onCheckedChange={(value) => column.toggleVisibility(!!value)}
    //           >
    //             {column.id}
    //           </DropdownMenuCheckboxItem>
    //         );
    //       })}
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
}
