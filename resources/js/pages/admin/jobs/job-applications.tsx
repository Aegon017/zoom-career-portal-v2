'use client';

import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { User, X } from 'lucide-react';

import JobApplicationCard from '@/components/job-application-card';
import MultipleSelector from '@/components/multiple-selector';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AppLayout from '@/layouts/app-layout';
import { Application, ApplicationStatus, BreadcrumbItem, Opening, Option } from '@/types';

const formSchema = z.object( {
    users: z
        .array(
            z.object( {
                value: z.string(),
                label: z.string(),
            } ),
        )
        .min( 1, { message: 'Please select at least one user.' } ),
} );

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Jobs', href: '/admin/jobs' },
    { title: 'Applications', href: '' },
];

interface Props {
    applications: Application[];
    statuses: ApplicationStatus[];
    users: Option[];
    job: Opening;
}

export default function JobApplications( { applications, statuses, users, job }: Props ) {
    const [ open, setOpen ] = useState( false );
    const [ loading, setLoading ] = useState( false );

    const form = useForm<z.infer<typeof formSchema>>( {
        defaultValues: { users: [] },
    } );

    const onSubmit = async ( values: z.infer<typeof formSchema> ) => {
        setLoading( true );
        const userIds = values.users.map( ( user ) => user.value );

        try {
            await router.post(
                `/admin/jobs/${ job.id }/applications`,
                { user_ids: userIds },
                {
                    onSuccess: () => {
                        setOpen( false );
                        form.reset();
                    },
                }
            );
        } finally {
            setLoading( false );
        }
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Applications" />

            <div className="flex h-full flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Applications for { job.title }</h1>
                    <Dialog open={ open } onOpenChange={ setOpen }>
                        <DialogTrigger asChild>
                            <Button variant="default" className="ml-auto">
                                Apply for Candidates
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="sm:max-w-[425px]">
                            <Form { ...form }>
                                <form onSubmit={ form.handleSubmit( onSubmit ) }>
                                    <DialogHeader>
                                        <DialogTitle>Apply for Job</DialogTitle>
                                        <DialogDescription>
                                            Select candidates to apply for this position.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-4">
                                        <FormField
                                            control={ form.control }
                                            name="users"
                                            render={ ( { field } ) => (
                                                <FormItem>
                                                    <FormLabel>Select Candidates</FormLabel>
                                                    <FormControl>
                                                        <MultipleSelector
                                                            options={ users }
                                                            value={ field.value }
                                                            onChange={ field.onChange }
                                                            placeholder="Search candidates..."
                                                            emptyIndicator={
                                                                <p className="w-full text-center text-sm text-muted-foreground">
                                                                    No candidates found
                                                                </p>
                                                            }
                                                            hidePlaceholderWhenSelected
                                                            creatable={ false }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            ) }
                                        />
                                    </div>

                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" type="button" disabled={ loading }>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" disabled={ loading }>
                                            { loading ? 'Applying...' : 'Apply' }
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                { applications?.length > 0 ? (
                    <div className="grid gap-4 lg:grid-cols-2">
                        { applications.map( ( application ) => (
                            <JobApplicationCard
                                key={ application.id }
                                application={ application }
                                statuses={ statuses }
                                message={ false }
                            />
                        ) ) }
                    </div>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center space-y-4">
                        <div className="rounded-full bg-muted p-4">
                            <User className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="space-y-1 text-center">
                            <h3 className="text-lg font-semibold">No applications yet</h3>
                            <p className="text-sm text-muted-foreground">
                                Applications will appear here once candidates apply for this position.
                            </p>
                        </div>
                    </div>
                ) }
            </div>
        </AppLayout>
    );
}