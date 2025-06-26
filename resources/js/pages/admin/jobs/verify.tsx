import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import AppLayout from "@/layouts/app-layout"
import { BreadcrumbItem, Opening } from "@/types"
import { Head, router } from "@inertiajs/react"
import { formatDate } from "date-fns"
import { Briefcase, CheckCircle, Shield } from "lucide-react"
import { useForm } from "react-hook-form"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Job Verify",
        href: "",
    },
];

interface Props {
    job: Opening
}

const Verify = ({ job }: Props) => {
    const form = useForm();

    const { control, handleSubmit } = form;

    const onSubmit = (data: any) => {
        router.post(`/admin/job/verify/${job.id}`, data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employer Verify" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="min-h-screen bg-background">
                    <div className="container mx-auto px-4 py-8 max-w-6xl">
                        {/* Header Section */}
                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Shield className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl font-bold text-foreground">Job Verification</h1>
                                            <p className="text-muted-foreground">Review job information</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-4">
                                        <CheckCircle className="w-5 h-5 text-success" />
                                        <Badge variant="secondary" className="bg-success/10 text-success border border-success/20">
                                            Pending Verification
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Employer Profile Section (left column) */}
                                    {/* ...existing employer profile and verification form... */}

                                    <div className="lg:col-span-3 space-y-6">
                                        {/* Company Information Card */}
                                        {/* ...your existing company info card code... */}

                                        {/* Job Details Card */}
                                        <Card className="shadow-lg backdrop-blur-sm">
                                            <CardHeader className="pb-4">
                                                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                                    <Briefcase className="w-5 h-5 text-primary" />
                                                    Job Details
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-4">
                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Job Title</p>
                                                            <p className="text-sm text-foreground">{job.title}</p>
                                                        </div>

                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Employment Type</p>
                                                            <p className="text-sm text-foreground capitalize">{job.employment_type}</p>
                                                        </div>

                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Work Model</p>
                                                            <p className="text-sm text-foreground capitalize">{job.work_model}</p>
                                                        </div>

                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Status</p>
                                                            <p className="text-sm text-foreground capitalize">{job.status}</p>
                                                        </div>

                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Verification Status</p>
                                                            <p className="text-sm text-foreground capitalize">{job.verification_status}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Location</p>
                                                            <p className="text-sm text-foreground">{`${job.city}, ${job.state}, ${job.country}`}</p>
                                                        </div>

                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Salary</p>
                                                            <p className="text-sm text-foreground">
                                                                {job.currency} {job.salary_min} – {job.salary_max} {job.salary_unit}
                                                            </p>
                                                        </div>

                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Published At</p>
                                                            <p className="text-sm text-foreground">{formatDate(new Date(job.published_at), "dd MMM yyyy")}</p>
                                                        </div>

                                                        <div className="p-3 bg-muted rounded-lg border border-muted/30">
                                                            <p className="text-xs text-muted-foreground font-medium">Expires At</p>
                                                            <p className="text-sm text-foreground">{formatDate(new Date(job.expires_at), "dd MMM yyyy")}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-3 bg-muted rounded-lg border border-muted/30 mt-4">
                                                    <p className="text-xs text-muted-foreground font-medium mb-1">Job Description</p>
                                                    <div
                                                        className="text-sm text-foreground"
                                                        dangerouslySetInnerHTML={{ __html: job.description }}
                                                    />
                                                </div>
                                            </CardContent>
                                            <Separator />

                                            <FormField
                                                control={control}
                                                name="status"
                                                render={({ field }) => (
                                                    <FormItem className="p-4">
                                                        <FormLabel>Verification Status</FormLabel>
                                                        <FormControl>
                                                            <Select defaultValue={job.verification_status} onValueChange={field.onChange}>
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select status" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="pending">Pending</SelectItem>
                                                                    <SelectItem value="verified">Verified</SelectItem>
                                                                    <SelectItem value="rejected">Rejected</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </Card>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end mt-8">
                                    <Button type="button" variant="outline" onClick={() => router.get("/admin/dashboard")}>Cancel</Button>
                                    <Button type="submit">Save</Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Verify
