import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Company, User } from '@/types';
import { Head } from '@inertiajs/react';
import { Briefcase, Building2, ExternalLink, Globe, Landmark, Mail, MapPin, Phone, User2, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employee',
        href: '',
    },
];

interface Props {
    user: User;
    company: Company;
}

const ViewEmployee = ({ user, company }: Props) => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employee" />
            <div className="mx-auto max-w-6xl space-y-8 px-4 py-8">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
                            <User2 className="text-primary h-5 w-5" />
                            Employee Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-3">
                            <div className="flex flex-col items-center space-y-4 text-center md:col-span-1">
                                <Avatar className="ring-primary/20 h-28 w-28 p-4 shadow ring-4">
                                    <AvatarImage src={user.avatar_url || undefined} />
                                    <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">{user.name?.[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-foreground text-xl font-bold">{user.name}</h3>
                                    <p className="text-muted-foreground mt-1 flex items-center justify-center gap-1 text-sm">
                                        <Mail className="h-4 w-4" />
                                        {user.email}
                                    </p>
                                </div>
                                <div className="flex w-full flex-col gap-2">
                                    {user.phone && (
                                        <div className="bg-muted flex items-center justify-center gap-3 rounded-lg p-2">
                                            <Phone className="text-muted-foreground h-4 w-4" />
                                            <span className="text-sm">{user.phone}</span>
                                        </div>
                                    )}
                                    {user.profile?.job_title && (
                                        <div className="bg-muted flex items-center justify-center gap-3 rounded-lg p-2">
                                            <Briefcase className="text-muted-foreground h-4 w-4" />
                                            <span className="text-sm">{user.profile.job_title}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="space-y-6 md:col-span-2">
                                <Card className="border-muted/20 border shadow-md">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-md text-foreground flex items-center gap-2 font-semibold">
                                            <Building2 className="text-primary h-5 w-5" />
                                            Company Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="mb-4 flex items-start gap-6">
                                            {company?.logo_url && (
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={company?.logo_url}
                                                        alt="Company Logo"
                                                        className="h-20 w-20 rounded-xl border bg-white object-contain p-2 shadow-sm"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h2 className="text-foreground text-xl font-bold">{company?.name}</h2>
                                                {company?.description && (
                                                    <p className="text-muted-foreground mt-1 line-clamp-3 text-sm">{company?.description}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {/* Left column */}
                                            <div className="space-y-3">
                                                {company?.industry && (
                                                    <InfoItem icon={<Briefcase />} label="Industry" value={company?.industry.name} />
                                                )}
                                                {company?.type && <InfoItem icon={<Landmark />} label="Company Type" value={company?.type} />}
                                                {company?.size && <InfoItem icon={<Users />} label="Company Size" value={company?.size} />}
                                            </div>

                                            {/* Right column */}
                                            <div className="space-y-3">
                                                {company?.website_url && (
                                                    <InfoItem
                                                        icon={<Globe />}
                                                        label="Website"
                                                        value={
                                                            <a
                                                                href={company?.website_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary flex items-center gap-1 truncate text-sm hover:underline"
                                                            >
                                                                {company?.website_url}
                                                                <ExternalLink className="h-3 w-3" />
                                                            </a>
                                                        }
                                                    />
                                                )}
                                                <InfoItem icon={<Mail />} label="Email" value={company?.email} />
                                                <InfoItem icon={<Phone />} label="Phone" value={company?.phone} />
                                                {company?.address && (
                                                    <InfoItem
                                                        icon={<MapPin />}
                                                        label="Address"
                                                        value={`${company?.address.location.city}, ${company?.address.location.state}, ${company?.address.location.country}`}
                                                    />
                                                )}
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

const InfoItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode | string }) => (
    <div className="bg-muted border-muted/30 flex items-start gap-3 rounded-lg border p-3">
        <div className="text-muted-foreground mt-1 h-5 w-5">{icon}</div>
        <div>
            <p className="text-muted-foreground text-xs font-medium">{label}</p>
            <p className="text-foreground text-sm leading-relaxed">{value}</p>
        </div>
    </div>
);

export default ViewEmployee;
