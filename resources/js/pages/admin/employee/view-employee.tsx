import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Company, User } from "@/types";
import { Head } from "@inertiajs/react";
import { Briefcase, Building2, ExternalLink, Globe, Landmark, Mail, MapPin, Phone, User2, Users } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Employee",
        href: "",
    },
];

interface Props {
    user: User;
    company: Company
}

const ViewEmployee = ( { user, company }: Props ) => {
    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Employee" />
            <div className="max-w-6xl mx-auto py-8 px-4 space-y-8">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold flex items-center gap-2 text-foreground">
                            <User2 className="w-5 h-5 text-primary" />
                            Employee Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                            <div className="flex flex-col items-center text-center space-y-4 md:col-span-1">
                                <Avatar className="h-28 w-28 ring-4 ring-primary/20 shadow p-4">
                                    <AvatarImage src={ user.avatar_url || undefined } />
                                    <AvatarFallback className="text-2xl font-semibold bg-primary/10 text-primary">
                                        { user.name?.[ 0 ] }
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-foreground">{ user.name }</h3>
                                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-1 mt-1">
                                        <Mail className="w-4 h-4" />
                                        { user.email }
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    { user.phone && (
                                        <div className="flex items-center gap-3 p-2 bg-muted rounded-lg justify-center">
                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{ user.phone }</span>
                                        </div>
                                    ) }
                                    { user.profile?.job_title && (
                                        <div className="flex items-center gap-3 p-2 bg-muted rounded-lg justify-center">
                                            <Briefcase className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm">{ user.profile.job_title }</span>
                                        </div>
                                    ) }
                                </div>
                            </div>

                            {/* Company Info */ }
                            <div className="md:col-span-2 space-y-6">
                                <Card className="border border-muted/20 shadow-md">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-md font-semibold flex items-center gap-2 text-foreground">
                                            <Building2 className="w-5 h-5 text-primary" />
                                            Company Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-start gap-6 mb-4">
                                            { company.logo_url && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={ company.logo_url }
                                                        alt="Company Logo"
                                                        className="h-20 w-20 object-contain border rounded-xl shadow-sm bg-white p-2"
                                                    />
                                                </div>
                                            ) }
                                            <div className="flex-1">
                                                <h2 className="text-xl font-bold text-foreground">{ company.name }</h2>
                                                { company.description && (
                                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                                                        { company.description }
                                                    </p>
                                                ) }
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Left column */ }
                                            <div className="space-y-3">
                                                { company.industry && (
                                                    <InfoItem icon={ <Briefcase /> } label="Industry" value={ company.industry.name } />
                                                ) }
                                                { company.type && (
                                                    <InfoItem icon={ <Landmark /> } label="Company Type" value={ company.type } />
                                                ) }
                                                { company.size && (
                                                    <InfoItem icon={ <Users /> } label="Company Size" value={ company.size } />
                                                ) }
                                            </div>

                                            {/* Right column */ }
                                            <div className="space-y-3">
                                                { company.website_url && (
                                                    <InfoItem
                                                        icon={ <Globe /> }
                                                        label="Website"
                                                        value={
                                                            <a
                                                                href={ company.website_url }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-primary hover:underline flex items-center gap-1 truncate"
                                                            >
                                                                { company.website_url }
                                                                <ExternalLink className="w-3 h-3" />
                                                            </a>
                                                        }
                                                    />
                                                ) }
                                                <InfoItem icon={ <Mail /> } label="Email" value={ company.email } />
                                                <InfoItem icon={ <Phone /> } label="Phone" value={ company.phone } />
                                                { company.address && (
                                                    <InfoItem
                                                        icon={ <MapPin /> }
                                                        label="Address"
                                                        value={ `${ company.address.location.city }, ${ company.address.location.state }, ${ company.address.location.country }` }
                                                    />
                                                ) }
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

const InfoItem = ( {
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode | string;
} ) => (
    <div className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-muted/30">
        <div className="w-5 h-5 text-muted-foreground mt-1">{ icon }</div>
        <div>
            <p className="text-xs text-muted-foreground font-medium">{ label }</p>
            <p className="text-sm text-foreground leading-relaxed">{ value }</p>
        </div>
    </div>
);

export default ViewEmployee;