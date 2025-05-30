import DeleteAlert from '@/components/delete-alert';
import { SelectPopoverField } from '@/components/select-popover-field';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { JobPosting, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    job: JobPosting;
    operation: 'Create' | 'Edit';
    operationLabel: string;
    employementTypes: Array<{ value: string; label: string }>;
    workModel: Array<{ value: string; label: string }>;
    salaryUnits: Array<{ value: string; label: string }>;
    currencies: Array<{ value: string; label: string }>;
}

const CreateOrEditJob = ({ job, operation, operationLabel, employementTypes, workModel, salaryUnits, currencies }: Props) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Jobs', href: route('jobs.index') },
        { title: operation, href: '' },
    ];

    const form = useForm<JobPosting>({
        defaultValues: {
            title: job?.title ?? '',
            employment_type: job?.employment_type ?? '',
            work_model: job?.work_model ?? '',
            salary_min: job?.salary_min ?? '',
            salary_max: job?.salary_max ?? '',
        },
    });

    const { handleSubmit, control, setError, setValue, watch } = form;

    const onSubmit = (data: any) => {
        console.log('Form data:', data);
        const handleErrors = (errors: Record<string, string>) => {
            Object.entries(errors).forEach(([field, message]) => {
                setError(field as keyof JobPosting, {
                    type: 'server',
                    message,
                });
            });
        };

        const routes = {
            Create: () => router.post(route('jobs.store'), data, { onError: handleErrors }),
            Edit: () => router.put(route('jobs.update', job.id), data, { onError: handleErrors }),
        };

        routes[operation]?.();
    };

    const handleDelete = (id: number) => {
        router.delete(route('jobs.destroy', id));
    };

    const [alertOpen, setAlertOpen] = useState(false);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const selectedEmploymentType = watch('employment_type');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${operation} Job`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">{operation} Job</h1>
                            {operation === 'Edit' && (
                                <>
                                    <Button variant="destructive" onClick={(e) => { e.preventDefault(); setAlertOpen(true); }}>
                                        Delete
                                    </Button>
                                    <DeleteAlert
                                        key={job.id}
                                        alertOpen={alertOpen}
                                        setAlertOpen={setAlertOpen}
                                        onDelete={() => handleDelete(job.id)}
                                    />
                                </>
                            )}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <FormField
                                rules={{ required: 'Job title is required' }}
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} autoComplete="organization-title" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select employement type' }}
                                control={control}
                                name="employment_type"
                                label="Employment type"
                                options={employementTypes}
                                placeholder='Select employment type'
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select work model' }}
                                control={control}
                                name="work_model"
                                label="Work model"
                                options={workModel}
                                placeholder='Select work model'
                            />

                            <FormField
                                control={control}
                                name="salary_min"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Minimum salary</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="salary_max"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Maximum salary</FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select salary unit' }}
                                control={control}
                                name="salary_unit"
                                label="Salary unit"
                                options={salaryUnits}
                                placeholder='Select salary unit'
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select currency' }}
                                control={control}
                                name="currency"
                                label="Currency"
                                options={currencies}
                                placeholder='Select currency'
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit">{operationLabel}</Button>
                            <Button type="button" variant="outline" onClick={() => router.get(route('jobs.index'))}>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
};

export default CreateOrEditJob;
