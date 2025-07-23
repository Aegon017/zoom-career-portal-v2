import { CreatableCombobox, Option } from '@/components/creatable-combobox';
import { AppHeader } from '@/components/employer/employer-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Company } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Building2 } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    companies: Company[];
}

type FormValues = {
    company: string;
    is_new: boolean;
};

const CompanyCreateOrJoin = ({ companies }: Props) => {
    const initialOptions = useMemo<Option[]>(
        () =>
            companies.map((company) => ({
                label: company.name,
                value: company.id.toString(),
            })),
        [companies],
    );

    const [companyOptions, setCompanyOptions] = useState<Option[]>(initialOptions);

    const form = useForm<FormValues>({
        defaultValues: {
            company: '',
            is_new: false,
        },
    });

    const { control, setError, handleSubmit, setValue, watch } = form;

    const selectedCompanyId = watch('company');

    const selectedCompany = useMemo(() => companyOptions.find((opt) => opt.value === selectedCompanyId), [companyOptions, selectedCompanyId]);

    const handleCompanyChange = useCallback(
        (newValue: string, isNew?: boolean) => {
            if (isNew) {
                const newOption = { label: newValue, value: newValue };
                setCompanyOptions((prev) => [...prev, newOption]);
                setValue('company', newOption.value);
                setValue('is_new', true);
            } else {
                setValue('company', newValue);
                setValue('is_new', false);
            }
        },
        [setValue],
    );

    const onSubmit = useCallback(
        (data: FormValues) => {
            router.post('/employer/on-boarding/company/create-or-join', data, {
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
            });
        },
        [setError],
    );

    return (
        <>
            <Head title="Company register" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="md:w-xl">
                    <h1 className="text-center text-2xl font-bold">Create or Join Your Company</h1>
                    <p className="mt-2 text-center text-sm text-gray-500">Join or create a company to get started.</p>
                    <div className="py-8">
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="space-y-6">
                                    <div className="grid gap-6 md:grid-cols-1">
                                        <FormField
                                            control={control}
                                            name="company"
                                            render={() => (
                                                <FormItem>
                                                    <FormLabel htmlFor="company">Company name</FormLabel>
                                                    <FormControl>
                                                        <CreatableCombobox
                                                            value={selectedCompanyId}
                                                            options={companyOptions}
                                                            onChange={handleCompanyChange}
                                                            placeholder="Search company..."
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <input type="hidden" {...form.register('is_new')} />
                                    </div>

                                    {selectedCompany && (
                                        <Card className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md dark:border-none dark:bg-gray-900">
                                            <CardHeader className="h-12 bg-gradient-to-r from-orange-100 to-orange-200 p-0" />

                                            <CardContent className="flex items-center gap-6 p-6">
                                                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600 shadow-sm ring-2 ring-orange-100 transition-all duration-300 hover:bg-orange-100 hover:text-orange-700">
                                                    <Building2 className="h-8 w-8" />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <h1 className="truncate text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
                                                        {selectedCompany.label}
                                                    </h1>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                                <div className="mt-8 flex justify-end">
                                    <Button type="submit" variant="default">
                                        Continue
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanyCreateOrJoin;
