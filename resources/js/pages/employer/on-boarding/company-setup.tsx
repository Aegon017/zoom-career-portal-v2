import CompanyForm from '@/components/company-form';
import { AppHeader } from '@/components/employer/employer-header';
import { Option } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

interface Props {
    name: string;
    industries: Option[];
    locations: Option[];
    sizes: Option[];
    types: Option[];
}

interface FormValues {
    name: string;
    logo_url: string;
    banner_url: string;
    industry_id: string;
    website_url: string;
    description: string;
    location_id: string;
    size: string;
    type: string;
    phone: string;
    email: string;
}

const CompanySetup = ({ name, industries, sizes, types }: Props) => {
    const form = useForm<FormValues>({
        defaultValues: {
            name: name,
        },
    });

    const { handleSubmit, control, setError, setValue } = form;

    const onSubmit = (data: FormValues) => {
        router.post(
            '/employer/on-boarding/setup/company',
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

    return (
        <>
            <Head title="Setup Company" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="w-full max-w-xl">
                    <h1 className="text-center text-2xl font-bold">Register Company</h1>
                    <p className="mt-2 text-center text-sm text-gray-500">Create your company account and start hiring talent</p>
                    <div className="py-8">
                        <CompanyForm
                            form={form}
                            control={control}
                            handleSubmit={handleSubmit}
                            onSubmit={onSubmit}
                            setValue={setValue}
                            industries={industries}
                            sizes={sizes}
                            types={types}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanySetup;
