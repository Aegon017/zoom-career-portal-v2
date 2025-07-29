

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import * as React from 'react';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

export interface Option {
    label: string;
    value: string;
}

interface CreatableComboboxProps {
    options: Option[];
    value?: string;
    onChange: (value: string, isNew?: boolean) => void;
    placeholder?: string;
    className?: string;
}

export function CreatableCombobox({ options: initialOptions, value, onChange, placeholder = 'Select item...', className }: CreatableComboboxProps) {
    const [open, setOpen] = React.useState(false);
    const [input, setInput] = React.useState('');
    const [options, setOptions] = React.useState<Option[]>(initialOptions);

    React.useEffect(() => {
        setOptions(initialOptions);
    }, [initialOptions]);

    const selectedOption = options.find((opt) => opt.value === value);
    const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(input.toLowerCase()));

    const handleSelect = (selectedValue: string) => {
        onChange(selectedValue, false);
        setInput('');
        setOpen(false);
    };

    const handleCreate = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const newOption: Option = {
            label: trimmed,
            value: trimmed,
        };

        setOptions((prev) => [...prev, newOption]);
        onChange(newOption.value, true);
        setInput('');
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={cn('justify-between', className)}>
                    {selectedOption?.label ?? placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search or create..." value={input} onValueChange={setInput} />
                    {filteredOptions.length === 0 && input.trim() ? (
                        <CommandEmpty>
                            <div className="flex items-center justify-between px-8">
                                <span>No results.</span>
                                <Button variant="ghost" size="sm" className="gap-1" onClick={handleCreate}>
                                    <PlusCircle className="h-4 w-4" />
                                    Create
                                </Button>
                            </div>
                        </CommandEmpty>
                    ) : (
                        <ScrollArea className="h-80 w-full">
                            <CommandGroup>
                                {filteredOptions.map((opt) => (
                                    <CommandItem key={opt.value} onSelect={() => handleSelect(opt.value)}>
                                        <Check className={cn('mr-2 h-4 w-4', value === opt.value ? 'opacity-100' : 'opacity-0')} />
                                        {opt.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <ScrollBar orientation="vertical" />
                        </ScrollArea>
                    )}
                </Command>
            </PopoverContent>
        </Popover>
    );
}
