import { useState } from 'react';
import { format, getMonth, getYear, setMonth, setYear } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { vi } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DatePicker = ({ value, onChange }: { value: string | undefined | null; onChange: any }) => {
  const [date, setDate] = useState<Date>(value ? new Date(value) : new Date());
  const months = [
    'Tháng Một',
    'Tháng Hai',
    'Tháng Ba',
    'Tháng Tư',
    'Tháng Năm',
    'Tháng Sáu',
    'Tháng Bảy',
    'Tháng Tám',
    'Tháng Chín',
    'Tháng Mười',
    'Tháng Mười Một',
    'Tháng Mười Hai',
  ];
  const years = Array.from({ length: 100 }, (_, i) => 1930 + i).reverse();

  const handleMonthChange = (month: string) => {
    const newDate = setMonth(date, months.indexOf(month));
    setDate(newDate);
    onChange(format(newDate, 'yyyy-MM-dd'));
  };

  const handleYearChange = (year: string) => {
    const newDate = setYear(date, parseInt(year));
    setDate(newDate);
    onChange(format(newDate, 'yyyy-MM-dd'));
  };

  const handleSelect = (selected: Date | undefined) => {
    if (selected) {
      setDate(selected);
      onChange(format(selected, 'yyyy-MM-dd'));
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd/MM/yyyy') : <span>Chọn ngày</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex justify-between gap-2 p-2">
          <Select onValueChange={handleMonthChange} value={months[getMonth(date)]}>
            <SelectTrigger className="w-2/3">
              <SelectValue placeholder="Tháng" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleYearChange} value={getYear(date).toString()}>
            <SelectTrigger className="w-1/3">
              <SelectValue placeholder="Năm" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year, index) => (
                <SelectItem key={index} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          locale={vi}
          selected={date}
          onSelect={handleSelect}
          month={date}
          onMonthChange={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
