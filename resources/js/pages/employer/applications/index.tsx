import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { SelectPopoverField } from "@/components/select-popover-field";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AppLayout from "@/layouts/employer-layout";
import { Form } from "@/components/ui/form";
import { Application, BreadcrumbItem, Opening } from "@/types";
import { Head, router } from "@inertiajs/react";
import { CalendarDays, Download, Mail, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Applications",
        href: "/employer/applications",
    },
];

interface ApplicationsProps {
    jobs: Opening[];
    applications: Application[];
    job: Opening;
}

const Index = ({ jobs, applications, job }: ApplicationsProps) => {
    const jobOptions = jobs.map((job) => ({
        value: String(job.id),
        label: job.title,
    }));

    const form = useForm({
        defaultValues: {
            job_id: String(job?.id || ""),
        },
    });

    const { handleSubmit, control, watch } = form;
    const jobId = watch("job_id");

    const hasMounted = useRef(false);

    const onSubmit = (data: any) => {
        router.get(route("employer.applications.index", data));
    };

    useEffect(() => {
        if (hasMounted.current) {
            handleSubmit(onSubmit)();
        } else {
            hasMounted.current = true;
        }
    }, [jobId]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Applications" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card className="p-0 shadow-none border-0 border-b-2 rounded-none">
                    <CardContent className="p-0 pb-4 space-y-4">
                        <Form {...form}>
                            <form>
                                <div className="grid grid-cols-4">
                                    <SelectPopoverField
                                        control={control}
                                        name="job_id"
                                        label=""
                                        options={jobOptions}
                                        placeholder="Select job"
                                    />
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    {applications && applications.length > 0 ? (
                        applications.map((application) => (
                            <div key={application.id} className="grid grid-cols-2 gap-4">
                                <Card key={application.id} className="hover:shadow-md transition-shadow duration-200">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-12 w-12">
                                                    <AvatarImage src={application.user.profile_image} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                        {application.user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="font-semibold text-lg leading-none mb-1">{application.user.name}</h3>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <CalendarDays className="h-3 w-3 mr-1" />
                                                        Applied{" "}
                                                        {new Date(application.created_at).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="grid gap-3">
                                            <div className="flex items-center text-sm">
                                                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                                <a href={`mailto:${application.user.email}`} className="text-primary hover:underline">
                                                    {application.user.email}
                                                </a>
                                            </div>

                                            {application.resume && (
                                                <div className="flex items-center justify-between pt-2 border-t">
                                                    <span className="text-sm text-muted-foreground">Resume attached</span>
                                                    <Button variant="outline" size="sm" asChild className="h-8">
                                                        <a
                                                            href={application.resume}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center"
                                                        >
                                                            <Download className="h-3 w-3 mr-1" />
                                                            View Resume
                                                        </a>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))
                    ) : (
                        <Card className="p-12">
                            <div className="text-center">
                                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                                <p className="text-muted-foreground">Applications will appear here once candidates start applying.</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
