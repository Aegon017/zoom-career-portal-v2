import CompanyForm from '@/components/company-form';
import AppLayout from '@/layouts/employer-layout';
import { BreadcrumbItem, Company, Option } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

interface Props {
    company: Company;
    industries: Option[];
    locations: Option[];
    sizes: Option[];
    types: Option[];
}

interface FormValues {
    name: string;
    logo_url: string;
    banner_url: string;
    industry_id: number;
    website_url: string;
    description: string;
    location_id: number;
    size: string;
    type: string;
    phone: string;
    email: string;
}

const EditCompany = ({ company, industries, locations, sizes, types }: Props) => {
    const form = useForm<FormValues>({
        defaultValues: {
            name: company.name || '',
            logo_url: company.logo_url || '',
            banner_url: company.banner_url || '',
            industry_id: company.industry_id ? company.industry_id : undefined,
            website_url: company.website_url || '',
            description: company.description || '',
            location_id: company.address ? company.address.location_id : undefined,
            size: company.size || '',
            type: company.type || '',
            phone: company.phone || '',
            email: company.email || '',
        },
    });

    const { handleSubmit, control, setError, setValue } = form;

    const onSubmit = (data: FormValues) => {
        router.put(
            `/employer/company/${company.id}`,
            { ...data },
            {
                onError: (errors) => {
                    if (errors && typeof errors === 'object') {
                        Object.entries(errors).forEach(([field, message]) => {
                            setError(field as keyof FormValues, {
                                type: 'server',
                                message: message as string,
                            });
                        });
                    }
                },
                preserveScroll: true,
            },
        );
    };

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Edit company',
            href: '',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Setup Company" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl px-16 py-8">
                <h1 className="text-2xl font-bold">Edit Company details</h1>
                <CompanyForm
                    form={form}
                    control={control}
                    handleSubmit={handleSubmit}
                    onSubmit={onSubmit}
                    setValue={setValue}
                    industries={industries}
                    locations={locations}
                    sizes={sizes}
                    types={types}
                />
            </div>
        </AppLayout>
    );
};

export default EditCompany;
