'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Head, router } from "@inertiajs/react";
import * as z from "zod";

import AppLayout from "@/layouts/app-layout";
import JobApplicationCard from "@/components/job-application-card";
import MultipleSelector from "@/components/multiple-selector";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
    Form, FormControl, FormField, FormItem,
    FormLabel, FormMessage
} from "@/components/ui/form";

import { Application, ApplicationStatus, BreadcrumbItem, Opening, Option } from "@/types";
import { User } from "lucide-react";

interface Props {
    applications: Application[];
    statuses: ApplicationStatus[];
    users: Option[];
    job: Opening;
}

const formSchema = z.object( {
    users: z.array( z.object( {
        value: z.string(),
        label: z.string(),
    } ) ).min( 1, { message: "Please select at least one user." } ),
} );

const breadcrumbs: BreadcrumbItem[] = [
    { title: "jobs", href: "/admin/jobs" },
    { title: "applications", href: "" },
];

const JobApplications = ( { applications, statuses, users, job }: Props ) => {
    const [ open, setOpen ] = useState( false );

    const form = useForm<z.infer<typeof formSchema>>( {
        defaultValues: { users: [] },
    } );

    const onSubmit = ( values: z.infer<typeof formSchema> ) => {
        const userIds = values.users.map( user => user.value );

        router.post(
            `/admin/jobs/${ job.id }/applications`,
            { user_ids: userIds },
            {
                onSuccess: () => {
                    setOpen( false );
                    form.reset();
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Applications" />

            <div className="flex flex-col gap-4 p-4 rounded-xl h-full">
                <Dialog open={ open } onOpenChange={ setOpen }>
                    <DialogTrigger asChild>
                        <Button variant="default" className="ml-auto">Apply</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <Form { ...form }>
                            <form onSubmit={ form.handleSubmit( onSubmit ) }>
                                <DialogHeader>
                                    <DialogTitle>Apply for job</DialogTitle>
                                    <DialogDescription>
                                        You are applying on behalf of a candidate. Review the details before submission.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="grid gap-4 py-4">
                                    <FormField
                                        control={ form.control }
                                        name="users"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Select Users</FormLabel>
                                                <FormControl>
                                                    <MultipleSelector
                                                        options={ users }
                                                        value={ field.value }
                                                        onChange={ field.onChange }
                                                        placeholder="Select users to apply..."
                                                        emptyIndicator={
                                                            <p className="text-center w-full text-sm text-gray-600 dark:text-gray-400">
                                                                No results found.
                                                            </p>
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                </div>

                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="outline" type="button">Cancel</Button>
                                    </DialogClose>
                                    <Button type="submit">Save changes</Button>
                                </DialogFooter>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

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
                    <div className="m-auto text-center">
                        <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">No applications found</h3>
                        <p className="text-muted-foreground">
                            Applications will appear here once candidates start applying.
                        </p>
                    </div>
                ) }
            </div>
        </AppLayout>
    );
};

export default JobApplications;