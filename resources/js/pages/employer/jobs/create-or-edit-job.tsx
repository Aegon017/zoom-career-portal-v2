import DeleteAlert from '@/components/delete-alert';
import { SelectPopoverField } from '@/components/select-popover-field';
import QuillEditor from '@/components/text-editor';
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
import { JobPosting, Skill, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { MultiSelect } from '@/components/multi-select';
import { log } from 'console';

interface Props {
    job: JobPosting;
    operation: 'Create' | 'Edit';
    operationLabel: string;
    employementTypes: Array<{ value: string; label: string }>;
    workModel: Array<{ value: string; label: string }>;
    salaryUnits: Array<{ value: string; label: string }>;
    currencies: Array<{ value: string; label: string }>;
    jobStatuses: Array<{ value: string; label: string }>;
    skills: Skill[];
}

interface Location {
    value: string;
    label: string;
}

const CreateOrEditJob = ({
    job,
    operation,
    operationLabel,
    employementTypes,
    workModel,
    salaryUnits,
    currencies,
    jobStatuses,
    skills
}: Props) => {
    const skillOptions = skills.map(skill => ({
        label: skill.name,
        value: String(skill.id),
    }));

    const [countries, setCountries] = useState<Location[]>([]);
    const [states, setStates] = useState<Record<string, Location[]>>({});
    const [cities, setCities] = useState<Record<string, Location[]>>({});
    const [alertOpen, setAlertOpen] = useState(false);

    const fetchCountries = async () => {
        try {
            const res = await fetch(route('getCountries'));
            const json = await res.json();

            if (json.data) {
                const formatted = json.data.map((c: any) => ({
                    value: c.name,
                    label: c.name,
                }));
                setCountries(formatted);
            }
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const fetchStates = async (countryName: string) => {
        try {
            const res = await fetch(route('getStates'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: countryName }),
            });
            const json = await res.json();

            if (json.data?.states) {
                const formatted = json.data.states.map((s: any) => ({
                    value: s.name,
                    label: s.name,
                }));
                setStates((prev) => ({ ...prev, [countryName]: formatted }));
            }
        } catch (error) {
            console.error('Error fetching states:', error);
        }
    };

    const fetchCities = async (countryName: string, stateName: string) => {
        try {
            const res = await fetch(route('getCities'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country: countryName, state: stateName }),
            });
            const json = await res.json();

            if (json.data) {
                const formatted = json.data.map((city: string) => ({
                    value: city,
                    label: city,
                }));
                setCities((prev) => ({ ...prev, [stateName]: formatted }));
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const form = useForm<JobPosting>({
        defaultValues: {
            title: job?.title ?? '',
            employment_type: job?.employment_type ?? '',
            work_model: job?.work_model ?? '',
            salary_min: job?.salary_min ?? '',
            salary_max: job?.salary_max ?? '',
            salary_unit: job?.salary_unit ?? '',
            currency: job?.currency ?? '',
            country: job?.country ?? '',
            state: job?.state ?? '',
            city: job?.city ?? '',
            description: job?.description ?? '',
            status: job?.status ?? '',
            expires_at: job?.expires_at ?? '',
            skills: job?.skills ?? [],
        },
    });

    const { handleSubmit, control, setError, setValue, watch } = form;

    const selectedCountry = watch('country');
    const selectedState = watch('state');

    useEffect(() => {
        if (selectedCountry) {
            fetchStates(selectedCountry);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedCountry && selectedState) {
            fetchCities(selectedCountry, selectedState);
        }
    }, [selectedState]);

    const onSubmit = (data: any) => {
        const handleErrors = (errors: Record<string, string>) => {
            Object.entries(errors).forEach(([field, message]) => {
                setError(field as keyof JobPosting, {
                    type: 'server',
                    message,
                });
            });
        };

        const routes = {
            Create: () => router.post(route('job-postings.store'), data, { onError: handleErrors }),
            Edit: () => router.put(route('job-postings.update', job.id), data, { onError: handleErrors }),
        };

        routes[operation]?.();
    };

    const handleDelete = (id: number) => {
        router.delete(route('job-postings.destroy', id));
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Jobs', href: route('job-postings.index') },
        { title: operation, href: '' },
    ];

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
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Job Title</FormLabel>
                                        <FormControl>
                                            <Input type="text" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                rules={{ required: 'Job description is required' }}
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Job description</FormLabel>
                                        <FormControl>
                                            <QuillEditor value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="skills"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Required skills</FormLabel>
                                        <FormControl>
                                            <MultiSelect
                                                options={skillOptions}
                                                defaultValue={field.value.map((v: any) => String(v.id))}
                                                value={field.value.map((v: any) => String(v.id))}
                                                onValueChange={(values) => field.onChange(values.map(id => ({ id: parseInt(id) })))}
                                                placeholder="Select skills required"
                                                variant="inverted"
                                                animation={2}
                                                maxCount={3}
                                            />
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
                                placeholder="Select employment type"
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select work model' }}
                                control={control}
                                name="work_model"
                                label="Work model"
                                options={workModel}
                                placeholder="Select work model"
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
                                placeholder="Select salary unit"
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select currency' }}
                                control={control}
                                name="currency"
                                label="Currency"
                                options={currencies}
                                placeholder="Select currency"
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select country' }}
                                control={control}
                                name="country"
                                label="Country"
                                options={countries}
                                placeholder="Select country"
                                onChange={() => {
                                    setValue('state', '');
                                    setValue('city', '');
                                }}
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select state' }}
                                control={control}
                                name="state"
                                label="State"
                                options={states[selectedCountry ?? ''] || []}
                                placeholder="Select state"
                                disabled={!selectedCountry}
                                onChange={() => {
                                    setValue('city', '');
                                }}
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select city' }}
                                control={control}
                                name="city"
                                label="City"
                                options={cities[selectedState ?? ''] || []}
                                placeholder="Select city"
                                disabled={!selectedState}
                            />
                            <FormField
                                rules={{ required: 'Please select expiry date' }}
                                control={control}
                                name="expires_at"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Expiry date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(field.value, "PPP")
                                                        ) : (
                                                            <span>Pick a date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    disabled={(date: any) =>
                                                        date < new Date() || date < new Date("1900-01-01")
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <SelectPopoverField
                                rules={{ required: 'Please select status' }}
                                control={control}
                                name="status"
                                label="Status"
                                options={jobStatuses}
                                placeholder="Select status"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit">{operationLabel}</Button>
                            <Button type="button" variant="outline" onClick={() => router.get(route('job-postings.index'))}>
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
