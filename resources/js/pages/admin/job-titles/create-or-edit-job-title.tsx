
import DeleteAlert from '@/components/delete-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { JobTitle, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const CreateOrEditJobTitle = ({ job_title, operation, operationLabel }: { job_title: JobTitle, operation: string, operationLabel: string }) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Job Titles',
            href: route('admin.job-titles.index'),
        },
        {
            title: operation,
            href: '',
        },
    ];

    const form = useForm<JobTitle>({
        defaultValues: {
            name: job_title?.name ?? "",
        }
    });

    const { handleSubmit, control, setError } = form;

    const onSubmit = (data: any) => {
        const handleErrors = (errors: any) => {
            if (errors && typeof errors === 'object') {
                Object.entries(errors).forEach(([field, message]) => {
                    setError(field as keyof JobTitle, {
                        type: 'server',
                        message: message as string,
                    });
                });
            }
        };

        const routes = {
            Create: () => router.post(route('admin.job-titles.store'), data, { onError: handleErrors }),
            Edit: () => router.put(route('admin.job-titles.update', job_title.id), data, { onError: handleErrors }),
        };

        routes[operation as keyof typeof routes]?.();
    };

    const handleDelete = (id: number) => {
        router.delete(route('admin.job-titles.destroy', id));
    }

    const [alertOpen, setAlertOpen] = useState<boolean>(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${operation} job title`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">{operation} job title</h1>
                            {operation === 'Edit' && (
                                <>
                                    <Button variant="destructive" onClick={(e) => { e.preventDefault(); setAlertOpen(true) }}>Delete</Button>
                                    <DeleteAlert
                                        key={job_title.id}
                                        alertOpen={alertOpen}
                                        setAlertOpen={setAlertOpen}
                                        onDelete={() => handleDelete(job_title.id)}
                                    />
                                </>
                            )}
                        </div>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Job title name</FormLabel>
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
                            <Button type="button" variant="outline" onClick={() => router.get(route('admin.job-titles.index'))}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout >
    );
}

export default CreateOrEditJobTitle