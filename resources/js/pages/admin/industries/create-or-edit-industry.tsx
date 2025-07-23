import DeleteAlert from '@/components/delete-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Industry, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    industry: Industry;
    operation: string;
    operationLabel: string;
}

const CreateOrEditIndustry = ({ industry, operation, operationLabel }: Props) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Industries',
            href: '/admin/industries',
        },
        {
            title: operation,
            href: '',
        },
    ];

    const form = useForm<Industry>({
        defaultValues: {
            name: industry?.name ?? '',
        },
    });

    const { handleSubmit, control, setError } = form;

    const onSubmit = (data: any) => {
        const handleErrors = (errors: any) => {
            if (errors && typeof errors === 'object') {
                Object.entries(errors).forEach(([field, message]) => {
                    setError(field as keyof Industry, {
                        type: 'server',
                        message: message as string,
                    });
                });
            }
        };

        const routes = {
            Create: () => router.post('/admin/industries', data, { onError: handleErrors }),
            Edit: () => router.put(`/admin/industries/${industry.id}`, data, { onError: handleErrors }),
        };

        routes[operation as keyof typeof routes]?.();
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/industries/${id}`);
    };

    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${operation} industry`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">{operation} industry</h1>
                            {operation === 'Edit' && (
                                <>
                                    <Button
                                        variant="destructive"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setAlertOpen(true);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                    <DeleteAlert
                                        key={industry.id}
                                        alertOpen={alertOpen}
                                        setAlertOpen={setAlertOpen}
                                        onDelete={() => handleDelete(industry.id)}
                                    />
                                </>
                            )}
                        </div>
                        <div className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Industry name</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} autoComplete="name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit">{operationLabel}</Button>
                            <Button type="button" variant="outline" onClick={() => router.get('/admin/industries')}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
};

export default CreateOrEditIndustry;
