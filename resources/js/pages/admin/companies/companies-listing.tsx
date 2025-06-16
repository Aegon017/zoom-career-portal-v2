import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/app-layout';
import { Company, type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { MapPin, Users, Building2, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Companies',
        href: route('admin.companies.index'),
    },
];

type CompaniesListingProps = {
    companies: {
        data: Company[];
        current_page: number;
        last_page: number;
        next_page_url: string | null;
    };
};

export default function CompaniesListing({ companies: initialCompanies }: CompaniesListingProps) {
    const [companies, setCompanies] = useState<Company[]>(initialCompanies.data);
    const [currentPage, setCurrentPage] = useState(initialCompanies.current_page);
    const [lastPage, setLastPage] = useState(initialCompanies.last_page);
    const [loadingMore, setLoadingMore] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('all');
    const [selectedIndustry, setSelectedIndustry] = useState('all');
    const [selectedSize, setSelectedSize] = useState('all');

    const getInitials = useInitials();

    const loadMore = () => {
        if (currentPage >= lastPage || loadingMore) return;

        setLoadingMore(true);

        router.get(
            route('admin.companies.index', { page: currentPage + 1 }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                only: ['companies'],
                onSuccess: () => {
                    const newPage = usePage().props.companies as typeof initialCompanies;
                    setCompanies((prev) => [...prev, ...newPage.data]);
                    setCurrentPage(newPage.current_page);
                    setLastPage(newPage.last_page);
                },
                onFinish: () => setLoadingMore(false),
            }
        );
    };

    const uniqueLocations = useMemo(
        () => Array.from(new Set(companies.map((c) => c.company_address).filter(Boolean))),
        [companies]
    );

    const uniqueIndustries = useMemo(
        () => Array.from(new Set(companies.map((c) => c.industry).filter(Boolean))),
        [companies]
    );

    const uniqueSizes = useMemo(
        () => Array.from(new Set(companies.map((c) => c.company_size).filter(Boolean))),
        [companies]
    );

    const filteredCompanies = useMemo(
        () =>
            companies.filter((company) => {
                const matchesSearch = searchQuery
                    ? company.company_name.toLowerCase().includes(searchQuery.toLowerCase())
                    : true;
                const matchesLocation =
                    selectedLocation === 'all' || company.company_address === selectedLocation;
                const matchesIndustry =
                    selectedIndustry === 'all' || company.industry === selectedIndustry;
                const matchesSize = selectedSize === 'all' || company.company_size === selectedSize;
                return matchesSearch && matchesLocation && matchesIndustry && matchesSize;
            }),
        [companies, searchQuery, selectedLocation, selectedIndustry, selectedSize]
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Companies" />
            <div className="p-4">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-1">Companies</h1>
                        <p className="text-sm text-muted-foreground">
                            View and manage all registered companies in the system.
                        </p>
                    </div>

                    <Card className="mb-6">
                        <CardContent className="p-4 space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Search companies..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Locations</SelectItem>
                                        {uniqueLocations.map((location, idx) => (
                                            <SelectItem key={idx} value={location}>
                                                {location}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Industries</SelectItem>
                                        {uniqueIndustries.map((industry, idx) => (
                                            <SelectItem key={idx} value={industry}>
                                                {industry}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={selectedSize} onValueChange={setSelectedSize}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Size" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Sizes</SelectItem>
                                        {uniqueSizes.map((size, idx) => (
                                            <SelectItem key={idx} value={size}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {filteredCompanies.map((company) => (
                            <Card key={company.id} className="hover:shadow-sm transition">
                                <CardContent className="p-4 sm:p-6">
                                    <div className="flex flex-col sm:flex-row items-start gap-4">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage
                                                src={company.company_logo || '/placeholder.svg'}
                                                alt={company.company_name}
                                            />
                                            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                                                {getInitials(company.company_name)}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1">
                                            <div className="mb-1">
                                                <h3 className="text-lg font-semibold text-foreground hover:text-primary cursor-pointer">
                                                    {company.company_name}
                                                </h3>
                                                <Badge variant="outline" className="text-xs mt-1">
                                                    {company.industry}
                                                </Badge>
                                            </div>

                                            {company.company_description && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                    {company.company_description}
                                                </p>
                                            )}

                                            <Separator className="my-2" />

                                            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{company.company_address}</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="h-4 w-4" />
                                                    <span>{company.company_size} employees</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Building2 className="h-4 w-4" />
                                                    <span>{company.company_type} company</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6">
                        {currentPage < lastPage && (
                            <Button onClick={loadMore} variant="outline" disabled={loadingMore}>
                                {loadingMore ? 'Loading...' : 'Load More'}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}