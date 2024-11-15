/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface DropdownSelectFieldProps {
  form: any;
  name: string;
  options: { label: string; value: string }[];
  label: string;
  placeholder?: string;
}

export const DropdownSelectField: React.FC<DropdownSelectFieldProps> = ({
  form,
  name,
  options,
  label,
  placeholder,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const value = form.watch(name);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full">
                    {value ? options.find((item) => item.value === value)?.label : placeholder}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandInput placeholder="Tìm kiếm..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={`${option.value} | ${option.label}`}
                          onSelect={(currentValue) => {
                            field.onChange(currentValue.split(' | ')[0]);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                          <Check className={cn('ml-auto', value === option.value ? 'opacity-100' : 'opacity-0')} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
