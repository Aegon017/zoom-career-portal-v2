import { useDebounce } from '@/hooks/use-debounce';
import { Link, router } from '@inertiajs/react';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from "@/components/ui/checkbox";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    listingName: string;
    createUrl?: string;
    hasCreate?: boolean;
    hasExport?: boolean;
    hasImport?: boolean;
    importUrl?: string;
    exportUrl?: string;
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

export function DataTable<TData, TValue>( {
    columns,
    data,
    listingName,
    createUrl,
    hasCreate = true,
    pagination,
    filters,
    routeName,
    hasExport,
    exportUrl,
    hasImport,
    importUrl
}: DataTableProps<TData, TValue> ) {
    const [ globalFilter, setGlobalFilter ] = useState( filters.search ?? '' );
    const [ isImporting, setIsImporting ] = useState( false );
    const fileInputRef = useRef<HTMLInputElement>( null );
    const debouncedSearch = useDebounce( globalFilter, 500 );
    const requestId = useRef( 0 );
    const firstRender = useRef( true );

    useEffect( () => {
        if ( firstRender.current ) {
            firstRender.current = false;
            const urlParams = new URLSearchParams( window.location.search );
            const currentSearch = urlParams.get( 'search' ) ?? '';
            const currentPerPage = urlParams.get( 'perPage' ) ?? String( pagination.per_page );

            if ( currentSearch === debouncedSearch && currentPerPage === String( pagination.per_page ) ) {
                return;
            }
        }

        const currentRequestId = ++requestId.current;

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
                    if ( currentRequestId !== requestId.current ) return;
                },
            },
        );
    }, [ debouncedSearch, pagination.per_page, routeName ] );

    const handlePageChange = ( page: number ) => {
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

    const handlePerPageChange = ( perPage: number ) => {
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

    const handleImport = ( e: ChangeEvent<HTMLInputElement> ) => {
        if ( !importUrl || !e.target.files?.[ 0 ] ) return;

        const file = e.target.files[ 0 ];
        setIsImporting( true );

        router.post(
            importUrl,
            { file },
            {
                forceFormData: true,
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => {
                    router.reload( {
                        only: [ 'data', 'pagination', 'filters' ],
                    } );
                },
                onFinish: () => {
                    setIsImporting( false );
                    if ( fileInputRef.current ) fileInputRef.current.value = '';
                }
            }
        );
    };

    const table = useReactTable( {
        data,
        columns,
        state: { globalFilter },
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        pageCount: pagination.last_page,
    } );

    const start = ( pagination.current_page - 1 ) * pagination.per_page + 1;
    const end = Math.min( pagination.current_page * pagination.per_page, pagination.total );
    const total = pagination.total.toLocaleString();

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing <span className="font-medium">{ start }</span> to <span className="font-medium">{ end }</span> of{ ' ' }
                    <span className="font-medium">{ total }</span> results
                </p>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search..."
                            value={ globalFilter }
                            onChange={ ( e ) => setGlobalFilter( e.target.value ) }
                            className="max-w-sm"
                        />
                        { hasExport && exportUrl && (
                            <a href={ exportUrl } download>
                                <Button variant="outline">Export</Button>
                            </a>
                        ) }
                        { hasImport && importUrl && (
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    disabled={ isImporting }
                                    onClick={ () => fileInputRef.current?.click() }
                                >
                                    { isImporting ? "Uploading..." : "Import" }
                                </Button>
                                <input
                                    ref={ fileInputRef }
                                    type="file"
                                    accept=".xlsx,.csv"
                                    onChange={ handleImport }
                                    className="hidden"
                                    disabled={ isImporting }
                                />
                            </div>
                        ) }
                    </div>

                    { hasCreate && createUrl && (
                        <Link href={ createUrl }>
                            <Button className="w-full sm:w-auto">New { listingName }</Button>
                        </Link>
                    ) }
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        { table.getHeaderGroups().map( ( headerGroup ) => (
                            <TableRow key={ headerGroup.id }>
                                { headerGroup.headers.map( ( header ) => (
                                    <TableHead key={ header.id }>
                                        { flexRender( header.column.columnDef.header, header.getContext() ) }
                                    </TableHead>
                                ) ) }
                            </TableRow>
                        ) ) }
                    </TableHeader>
                    <TableBody>
                        { table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map( ( row ) => (
                                <TableRow key={ row.id } data-state={ row.getIsSelected() && 'selected' }>
                                    { row.getVisibleCells().map( ( cell ) => (
                                        <TableCell key={ cell.id }>
                                            { flexRender( cell.column.columnDef.cell, cell.getContext() ) }
                                        </TableCell>
                                    ) ) }
                                </TableRow>
                            ) )
                        ) : (
                            <TableRow>
                                <TableCell colSpan={ columns.length } className="h-24 text-center">
                                    No results found
                                </TableCell>
                            </TableRow>
                        ) }
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-col items-center gap-4 px-2 sm:flex-row sm:justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={ String( pagination.per_page ) }
                        onValueChange={ ( value ) => handlePerPageChange( Number( value ) ) }
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            { [ 10, 20, 30, 50 ].map( ( size ) => (
                                <SelectItem key={ size } value={ String( size ) }>
                                    { size }
                                </SelectItem>
                            ) ) }
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={ () => handlePageChange( 1 ) }
                        disabled={ pagination.current_page === 1 }
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={ () => handlePageChange( pagination.current_page - 1 ) }
                        disabled={ pagination.current_page === 1 }
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="px-4 text-sm">
                        Page { pagination.current_page } of { pagination.last_page }
                    </span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={ () => handlePageChange( pagination.current_page + 1 ) }
                        disabled={ pagination.current_page === pagination.last_page }
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={ () => handlePageChange( pagination.last_page ) }
                        disabled={ pagination.current_page === pagination.last_page }
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}