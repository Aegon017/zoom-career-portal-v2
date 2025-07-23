import { Company, SharedData, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Briefcase, ExternalLink, Globe, Landmark, Mail, MapPin, Phone, Users } from 'lucide-react';

interface Props {
    company: Company;
}

const CompanyDetails = ({ company }: Props) => {
    const { auth } = usePage<SharedData>().props;
    return (
        <div className="container">
            <div className="relative mb-6 h-64 overflow-hidden bg-gradient-to-r from-blue-950 to-orange-800">
                {company.banner_url && <img className="absolute w-full object-cover" src={company.banner_url} alt="" />}
                {company.users.some((user: User) => user.id === auth.user.id) && (
                    <Link
                        href="/employer/company/edit"
                        method="get"
                        className="absolute top-8 right-8 rounded-sm bg-white px-4 py-2 shadow-lg hover:bg-white/80"
                    >
                        Edit details
                    </Link>
                )}
            </div>
            <div className="px-8">
                <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row">
                    {company.logo_url && (
                        <div className="flex-shrink-0">
                            <img
                                src={company.logo_url}
                                alt="Company Logo"
                                className="h-20 w-20 rounded-xl border bg-white object-contain p-2 shadow-sm"
                            />
                        </div>
                    )}
                    <div className="flex-1">
                        <h2 className="text-foreground mb-2 text-2xl font-bold break-words">{company.name}</h2>
                        {company.description && <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">{company.description}</p>}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {company.industry && (
                        <div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
                            <Briefcase className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs font-medium">Industry</p>
                                <p className="text-foreground text-sm break-words">{company.industry.name}</p>
                            </div>
                        </div>
                    )}

                    {company.type && (
                        <div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
                            <Landmark className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs font-medium">Company Type</p>
                                <p className="text-foreground text-sm break-words">{company.type}</p>
                            </div>
                        </div>
                    )}

                    {company.size && (
                        <div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
                            <Users className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs font-medium">Company Size</p>
                                <p className="text-foreground text-sm break-words">{company.size}</p>
                            </div>
                        </div>
                    )}

                    {company.website_url && (
                        <div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
                            <Globe className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <p className="text-muted-foreground text-xs font-medium">Website</p>
                                <a
                                    href={company.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary flex items-center gap-1 text-sm break-all hover:underline"
                                >
                                    {company.website_url}
                                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                                </a>
                            </div>
                        </div>
                    )}

                    {company.email && (
                        <div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
                            <Mail className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs font-medium">Email</p>
                                <p className="text-foreground text-sm break-words">{company.email}</p>
                            </div>
                        </div>
                    )}

                    {company.phone && (
                        <div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
                            <Phone className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs font-medium">Phone</p>
                                <p className="text-foreground text-sm break-words">{company.phone}</p>
                            </div>
                        </div>
                    )}

                    {company.address && (
                        <div className="bg-muted border-muted/30 flex items-start gap-3 rounded-lg border p-3">
                            <MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="text-muted-foreground text-xs font-medium">Address</p>
                                <p className="text-foreground text-sm leading-relaxed break-words">
                                    {company.address.location.city}, {company.address.location.state}, {company.address.location.country}
                                </p>
                            </div>
                        </div>
                    )}
                    <div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
                        <Phone className="text-muted-foreground h-4 w-4 flex-shrink-0" />
                        <div>
                            <p className="text-muted-foreground text-xs font-medium">Verification status</p>
                            <p className="text-foreground text-sm break-words">{company.verification_status}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyDetails;
