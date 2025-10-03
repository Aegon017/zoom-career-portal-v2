"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import useSWR from "swr";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDebounce } from "@/hooks/use-debounce";
import { Option } from "@/types";

interface ComboboxProps {
	value?: string;
	onValueChange: (value: string, option?: Option) => void;
	apiUrl: string;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	className?: string;
	buttonClassName?: string;
	disabled?: boolean;
	initialOptions?: Option[];
	queryParams?: Record<string, string>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Combobox({
	value,
	onValueChange,
	apiUrl,
	placeholder = "Select an option...",
	searchPlaceholder = "Search...",
	emptyMessage = "No results found.",
	className,
	buttonClassName,
	disabled = false,
	initialOptions = [],
	queryParams = {},
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState("");
	const debouncedQuery = useDebounce(searchQuery, 300);
	const [cachedOption, setCachedOption] = React.useState<Option | null>(null);

	const buildUrl = React.useCallback(() => {
		const url = new URL(apiUrl, window.location.origin);
		if (debouncedQuery) url.searchParams.set("search", debouncedQuery);
		Object.entries(queryParams).forEach(([key, value]) => {
			url.searchParams.set(key, value);
		});
		return url.toString();
	}, [apiUrl, debouncedQuery, queryParams]);

	const { data, error, isLoading } = useSWR<Option[]>(
		open ? buildUrl() : null,
		fetcher,
		{
			fallbackData: initialOptions,
			revalidateOnFocus: false,
			keepPreviousData: true,
		},
	);

	const selectedOption = React.useMemo(() => {
		if (!value) return null;
		return data?.find((opt) => opt.value === value) ?? cachedOption;
	}, [value, data, cachedOption]);

	const handleSelect = React.useCallback(
		(currentValue: string) => {
			const option = data?.find((opt) => opt.value === currentValue);
			const newValue = currentValue === value ? "" : currentValue;
			if (option) setCachedOption(option);
			onValueChange(newValue, option);
			setOpen(false);
			setSearchQuery("");
		},
		[data, value, onValueChange],
	);

	const options = React.useMemo(() => data ?? [], [data]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("w-full justify-between", buttonClassName)}
					disabled={disabled}
				>
					<span className="truncate">
						{selectedOption?.label ?? placeholder}
					</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className={cn("w-full p-0", className)} align="start">
				<Command shouldFilter={false}>
					<CommandInput
						placeholder={searchPlaceholder}
						value={searchQuery}
						onValueChange={setSearchQuery}
					/>
					<CommandList>
						{isLoading ? (
							<div className="flex items-center space-x-2 px-2 py-1.5">
								<div className="h-4 w-4 rounded-md bg-muted animate-pulse" />
								<div className="h-4 w-full rounded-md bg-muted animate-pulse" />
							</div>
						) : error ? (
							<div className="flex items-center justify-center py-6 text-sm text-destructive">
								Failed to load options
							</div>
						) : (
							<>
								<CommandEmpty>{emptyMessage}</CommandEmpty>
								<CommandGroup>
									{options.map((option) => (
										<CommandItem
											key={option.value}
											value={option.value}
											onSelect={handleSelect}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4 shrink-0",
													value === option.value ? "opacity-100" : "opacity-0",
												)}
											/>
											<span className="truncate">{option.label}</span>
										</CommandItem>
									))}
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
