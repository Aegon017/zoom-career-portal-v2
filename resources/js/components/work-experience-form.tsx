import FileUpload from '@/components/file-upload';
import { SelectPopoverField } from '@/components/select-popover-field';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Company, WorkExperience } from '@/types';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { DatePicker } from './date-picker';
import { DialogClose, DialogFooter } from './ui/dialog';

interface Props {
    companies: Company[];
    onSubmit: (data: WorkExperience) => void;
    defaultValues?: Partial<WorkExperience>;
}

export default function WorkExperienceForm({ companies, onSubmit, defaultValues }: Props) {
    const [manualEntry, setManualEntry] = useState(false);
    const form = useForm<WorkExperience>({
        defaultValues: {
            ...defaultValues,
            is_current: defaultValues?.is_current ?? false,
        },
    });

    const { control, handleSubmit, watch, setValue } = form;

    const is_current = watch('is_current');

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-1">
                    {!manualEntry ? (
                        <SelectPopoverField
                            label="Select Company"
                            name="company_id"
                            control={control}
                            placeholder="Search company..."
                            options={companies.map((c) => ({
                                value: String(c.id),
                                label: c.company_name,
                            }))}
                        />
                    ) : (
                        <>
                            <FormField
                                name="company_name"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter company name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={control}
                                name="company_logo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company Logo</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                acceptedFileTypes={['image/*']}
                                                placeholder="Upload logo"
                                                name="file"
                                                onUploaded={(url) => setValue('company_logo', url)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    <div className="flex items-center gap-2 md:col-span-2">
                        <Checkbox
                            checked={manualEntry}
                            onCheckedChange={(v) => {
                                setManualEntry(Boolean(v));
                                setValue('company_id', undefined);
                            }}
                            id="manualCompany"
                        />
                        <label htmlFor="manualCompany" className="text-muted-foreground text-sm">
                            Company not listed? Add manually
                        </label>
                    </div>
                </div>

                <FormField
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g. Senior Developer" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        name="start_date"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                    <DatePicker
                                        date={field.value ? new Date(field.value) : undefined}
                                        onChange={(date) => field.onChange(date?.toISOString())}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    {!is_current && (
                        <FormField
                            name="end_date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value ? new Date(field.value) : undefined}
                                            onChange={(date) => field.onChange(date?.toISOString())}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </div>

                <FormField
                    name="is_current"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-2">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} id="is_current" />
                            </FormControl>
                            <FormLabel htmlFor="is_current">I currently work here</FormLabel>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end">
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="ghost">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit">Save</Button>
                    </DialogFooter>
                </div>
            </form>
        </Form>
    );
}
