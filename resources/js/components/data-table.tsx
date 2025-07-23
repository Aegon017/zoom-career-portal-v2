import { useDebounce } from '@/hooks/use-debounce';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    listingName: string;
    createUrl: string;
    hasCreate?: boolean;
    pagination: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    filters: {
        search?: string;
        perPage?: number;
    };
    routeName: string;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    listingName,
    createUrl,
    hasCreate = true,
    pagination,
    filters,
    routeName,
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState(filters.search ?? '');
    const debouncedSearch = useDebounce(globalFilter, 500);
    const requestId = useRef(0);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            const urlParams = new URLSearchParams(window.location.search);
            const currentSearch = urlParams.get('search') ?? '';
            const currentPerPage = urlParams.get('perPage') ?? String(pagination.per_page);
            if (currentSearch === debouncedSearch && currentPerPage === String(pagination.per_page)) return;
        }

        requestId.current += 1;
        const currentRequest = requestId.current;

        router.get(
            routeName,
            {
                search: debouncedSearch,
                page: 1,
                perPage: pagination.per_page,
            },
            {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    if (currentRequest !== requestId.current) return;
                },
            },
        );
    }, [debouncedSearch]);

    const handlePageChange = (page: number) => {
        router.get(
            routeName,
            {
                search: globalFilter,
                page,
                perPage: pagination.per_page,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handlePerPageChange = (perPage: number) => {
        router.get(
            routeName,
            {
                search: globalFilter,
                page: 1,
                perPage,
            },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const table = useReactTable({
        data,
        columns,
        state: { globalFilter },
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: pagination.last_page,
    });

    return (
        <>
            <div className="flex items-center justify-between">
                <Input placeholder="Search..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="max-w-sm" />
                {hasCreate && (
                    <Link href={createUrl}>
                        <Button>New {listingName}</Button>
                    </Link>
                )}
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select value={String(pagination.per_page)} onValueChange={(value) => handlePerPageChange(Number(value))}>
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pagination.per_page} />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30, 50].map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => handlePageChange(1)} disabled={pagination.current_page === 1}>
                        <ChevronsLeft />
                    </Button>
                    <Button variant="outline" onClick={() => handlePageChange(pagination.current_page - 1)} disabled={pagination.current_page === 1}>
                        <ChevronLeft />
                    </Button>
                    <span className="text-sm">
                        Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.current_page + 1)}
                        disabled={pagination.current_page === pagination.last_page}
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.last_page)}
                        disabled={pagination.current_page === pagination.last_page}
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </>
    );
}
