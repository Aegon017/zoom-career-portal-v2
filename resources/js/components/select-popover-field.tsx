import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { Control } from 'react-hook-form';

type Option = {
    label: string;
    value: string;
};

interface SelectPopoverFieldProps {
    control: Control<any>;
    name: string;
    label: string;
    options: Option[];
    placeholder?: string;
    rules?: Record<string, any>;
    disabled?: boolean;
    onChange?: (value: string) => void;
    onValueChange?: (value: string) => void;
}

export const SelectPopoverField = ({
    control,
    name,
    label,
    options,
    placeholder,
    rules,
    disabled = false,
    onChange,
    onValueChange,
}: SelectPopoverFieldProps) => {
    const [open, setOpen] = useState(false);

    return (
        <FormField
            rules={rules}
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild disabled={disabled}>
                            <FormControl>
                                <Button variant="outline" role="combobox" className={cn('justify-between', !field.value && 'text-muted-foreground')}>
                                    {field.value ? options.find((opt) => opt.value === field.value)?.label : placeholder}
                                    <ChevronsUpDown className="opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                            <Command>
                                <CommandInput onValueChange={onValueChange} placeholder={`Search ${label.toLowerCase()}...`} className="h-9" />
                                <CommandList>
                                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option) => (
                                            <CommandItem
                                                key={option.value}
                                                value={option.label}
                                                onSelect={() => {
                                                    field.onChange(option.value);
                                                    setOpen(false);
                                                }}
                                            >
                                                {option.label}
                                                <Check className={cn('ml-auto', option.value === field.value ? 'opacity-100' : 'opacity-0')} />
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
