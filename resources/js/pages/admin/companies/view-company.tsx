import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Company } from "@/types";
import { Head, router } from "@inertiajs/react";
import {
    Briefcase,
    Building2,
    ExternalLink,
    Globe,
    Landmark,
    Mail,
    MapPin,
    Phone,
    Users,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Company",
        href: "",
    },
];

interface Props {
    company: Company;
}


interface FormData {
    verification_status: string;
}

const ViewCompany = ({ company }: Props) => {
    const form = useForm<FormData>({
        defaultValues: {
            verification_status: company.verification_status ?? ""
        }
    });

    const { control, watch, handleSubmit } = form;

    const verificationStatus = watch('verification_status');

    const onSubmit = (data: FormData) => {
        router.patch(route("admin.companies.update", company.id), {
            verification_status: data.verification_status,
        });
    }

    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current) {
            handleSubmit(onSubmit)();
        } else {
            hasMounted.current = true;
        }
    }, [verificationStatus]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Company" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 sm:p-6 lg:p-8">
                <div className="space-y-6">
                    <Card className="shadow-lg backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                                    <Building2 className="w-5 h-5 text-primary" />
                                    Company Information
                                </CardTitle>
                                <Form {...form}>
                                    <form>
                                        <FormField
                                            control={control}
                                            name="verification_status"
                                            render={({ field }) => (
                                                <FormItem className="p-0">
                                                    <FormControl>
                                                        <Select
                                                            defaultValue={company.verification_status}
                                                            onValueChange={field.onChange}
                                                        >
                                                            <SelectTrigger className="w-full sm:w-64">
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
                                    </form>
                                </Form>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
                                {company.company_logo && (
                                    <div className="flex-shrink-0">
                                        <img
                                            src={company.company_logo || "/placeholder.svg"}
                                            alt="Company Logo"
                                            className="h-20 w-20 object-contain border rounded-xl shadow-sm bg-white p-2"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-foreground mb-2 break-words">
                                        {company.company_name}
                                    </h2>
                                    {company.company_description && (
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                            {company.company_description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                                        Company Details
                                    </h4>

                                    {company.industry && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                                            <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Industry</p>
                                                <p className="text-sm text-foreground break-words">
                                                    {company.industry}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {company.company_type && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                                            <Landmark className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Company Type</p>
                                                <p className="text-sm text-foreground break-words">
                                                    {company.company_type}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {company.company_size && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                                            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Company Size</p>
                                                <p className="text-sm text-foreground break-words">
                                                    {company.company_size}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                                        Contact Information
                                    </h4>

                                    {company.company_website && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                                            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground font-medium">Website</p>
                                                <a
                                                    href={company.company_website}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-primary hover:underline flex items-center gap-1 break-all"
                                                >
                                                    {company.company_website}
                                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                </a>
                                            </div>
                                        </div>
                                    )}

                                    {company.public_email && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Email</p>
                                                <p className="text-sm text-foreground break-words">
                                                    {company.public_email}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {company.public_phone && (
                                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                                            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Phone</p>
                                                <p className="text-sm text-foreground break-words">
                                                    {company.public_phone}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {company.company_address && (
                                        <div className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium">Address</p>
                                                <p className="text-sm text-foreground leading-relaxed break-words">
                                                    {company.company_address}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default ViewCompany;