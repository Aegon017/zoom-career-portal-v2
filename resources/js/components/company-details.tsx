import { Company, SharedData, User } from "@/types"
import { Briefcase, ExternalLink, Globe, Landmark, Mail, MapPin, Phone, Users } from "lucide-react"
import { Link, usePage } from "@inertiajs/react";

interface Props {
    company: Company
}

const CompanyDetails = ( { company }: Props ) => {
    const { auth } = usePage<SharedData>().props;
    return (
        <div className="container">
            <div className="relative mb-6 overflow-hidden h-64 bg-gradient-to-r from-blue-950 to-orange-800">
                {
                    company.banner_url && (
                        <img className="absolute object-cover w-full" src={ company.banner_url } alt="" />
                    )
                }
                { company.users.some( ( user: User ) => user.id === auth.user.id ) && (
                    <Link
                        href="/employer/company/edit"
                        method="get"
                        className="absolute top-8 right-8 bg-white py-2 px-4 rounded-sm hover:bg-white/80 shadow-lg"
                    >
                        Edit details
                    </Link>
                ) }
            </div>
            <div className="px-8">
                <div className="flex flex-col sm:flex-row items-start gap-4 mb-8">
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
                        <h2 className="text-2xl font-bold text-foreground mb-2 break-words">
                            { company.name }
                        </h2>
                        { company.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                { company.description }
                            </p>
                        ) }
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    { company.industry && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                            <Briefcase className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Industry</p>
                                <p className="text-sm text-foreground break-words">
                                    { company.industry.name }
                                </p>
                            </div>
                        </div>
                    ) }

                    { company.type && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                            <Landmark className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Company Type</p>
                                <p className="text-sm text-foreground break-words">
                                    { company.type }
                                </p>
                            </div>
                        </div>
                    ) }

                    { company.size && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                            <Users className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Company Size</p>
                                <p className="text-sm text-foreground break-words">
                                    { company.size }
                                </p>
                            </div>
                        </div>
                    ) }

                    { company.website_url && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                            <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs text-muted-foreground font-medium">Website</p>
                                <a
                                    href={ company.website_url }
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1 break-all"
                                >
                                    { company.website_url }
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                            </div>
                        </div>
                    ) }

                    { company.email && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Email</p>
                                <p className="text-sm text-foreground break-words">
                                    { company.email }
                                </p>
                            </div>
                        </div>
                    ) }

                    { company.phone && (
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Phone</p>
                                <p className="text-sm text-foreground break-words">
                                    { company.phone }
                                </p>
                            </div>
                        </div>
                    ) }

                    { company.address && (
                        <div className="flex items-start gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                            <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground font-medium">Address</p>
                                <p className="text-sm text-foreground leading-relaxed break-words">
                                    { company.address.location.city }, { company.address.location.state }, { company.address.location.country }
                                </p>
                            </div>
                        </div>
                    ) }
                    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg border border-muted/30">
                        <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <div>
                            <p className="text-xs text-muted-foreground font-medium">Verification status</p>
                            <p className="text-sm text-foreground break-words">
                                { company.verification_status }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetails