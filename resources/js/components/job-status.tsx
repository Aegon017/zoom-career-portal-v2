import { Application, ApplicationStatus } from '@/types';
import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface JobStatusProps {
    statuses: ApplicationStatus[];
    application: Application;
}

const JobStatus = ({ statuses, application }: JobStatusProps) => {
    const onSubmit = (data: any) => {
        router.post('/employer/applications', data, {
            preserveScroll: true,
        });
    };

    const form = useForm({
        defaultValues: {
            applicationId: application.id,
            status: application.status ?? '',
        },
    });

    const { control, watch, handleSubmit } = form;

    const status = watch('status');

    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current) {
            handleSubmit(onSubmit)();
        } else {
            hasMounted.current = true;
        }
    }, [status]);

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <FormField
                    control={form.control}
                    name="applicationId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input type="hidden" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {statuses.map((status, index) => (
                                        <SelectItem key={index} value={status.value}>
                                            {status.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
};

export default JobStatus;
