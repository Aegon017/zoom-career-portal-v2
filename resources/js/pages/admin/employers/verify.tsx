import AppLayout from "@/layouts/app-layout"
import type { Company, Employer, User, BreadcrumbItem } from "@/types"
import { Head, router } from "@inertiajs/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Building2,
    Globe,
    Mail,
    MapPin,
    Phone,
    User2,
    Briefcase,
    Users,
    Landmark,
    ExternalLink,
    Shield,
    CheckCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Employer Verify",
        href: "",
    },
]

export default function Show({
    user,
    employer_profile,
    company,
    pivot,
}: {
    user: User
    employer_profile: Employer
    company: Company
    pivot: any
}) {

    const form = useForm({
        defaultValues: {
            status: pivot.status ?? "",
            verification_status: company.verification_status ?? ""
        }
    });

    const onSubmit = (formData: any) => {
        const data = { ...formData, 'company_id': company.id, 'user_id': user.id };
        router.post(route('admin.employer.verify.store'), data);
    }

    const { handleSubmit, control, setError } = form;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employer Verify" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100/50">
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
                                        <h1 className="text-3xl font-bold text-gray-900">Employer Verification</h1>
                                        <p className="text-gray-600">Review employer and company information</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-4">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                                        Pending Verification
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Left Column - Employer Details */}
                                <div className="lg:col-span-1 space-y-6">
                                    {/* Employer Profile Card */}
                                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                                <User2 className="w-5 h-5 text-primary" />
                                                Employer Profile
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-6">
                                            {/* Profile Section */}
                                            <div className="flex flex-col items-center text-center space-y-4">
                                                <Avatar className="h-24 w-24 ring-4 ring-primary/10 shadow-lg">
                                                    <AvatarImage src={user.profile_image || undefined} />
                                                    <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
                                                        {user.name?.[0]}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
                                                    <p className="text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                                                        <Mail className="w-4 h-4" />
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            <Separator />

                                            {/* Contact Information */}
                                            <div className="space-y-3">
                                                <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Contact Details</h4>

                                                {employer_profile.phone && (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{employer_profile.phone}</span>
                                                    </div>
                                                )}

                                                {employer_profile.opening_title?.name && (
                                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                        <Briefcase className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                        <span className="text-sm text-gray-700">{employer_profile.opening_title.name}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <Separator />

                                        <FormField
                                            control={control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem className="p-4">
                                                    <FormLabel>Verfication status</FormLabel>
                                                    <FormControl>
                                                        <Select defaultValue={pivot.status}>
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

                                {/* Right Column - Company Details */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Company Information Card */}
                                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                                        <CardHeader className="pb-4">
                                            <CardTitle className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                                                <Building2 className="w-5 h-5 text-primary" />
                                                Company Information
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            {/* Company Header */}
                                            <div className="flex items-start gap-6 mb-8">
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
                                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{company.company_name}</h2>
                                                    {company.company_description && (
                                                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                                            {company.company_description}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Company Details Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Left Column */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Company Details</h4>

                                                    {company.industry && (
                                                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                                            <Briefcase className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs text-blue-600 font-medium">Industry</p>
                                                                <p className="text-sm text-blue-900">{company.industry}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {company.company_type && (
                                                        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                                            <Landmark className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs text-purple-600 font-medium">Company Type</p>
                                                                <p className="text-sm text-purple-900">{company.company_type}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {company.company_size && (
                                                        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                                                            <Users className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs text-green-600 font-medium">Company Size</p>
                                                                <p className="text-sm text-green-900">{company.company_size}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right Column */}
                                                <div className="space-y-4">
                                                    <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wide">Contact Information</h4>

                                                    {company.company_website && (
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                                            <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs text-gray-500 font-medium">Website</p>
                                                                <a
                                                                    href={company.company_website}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate"
                                                                >
                                                                    {company.company_website}
                                                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {company.public_email && (
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                                            <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 font-medium">Email</p>
                                                                <p className="text-sm text-gray-700">{company.public_email}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {company.public_phone && (
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                                            <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 font-medium">Phone</p>
                                                                <p className="text-sm text-gray-700">{company.public_phone}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {company.company_address && (
                                                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border">
                                                            <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="text-xs text-gray-500 font-medium">Address</p>
                                                                <p className="text-sm text-gray-700 leading-relaxed">{company.company_address}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <Separator />
                                        <FormField
                                            control={control}
                                            name="verification_status"
                                            render={({ field }) => (
                                                <FormItem className="p-4">
                                                    <FormLabel>Verfication status</FormLabel>
                                                    <FormControl>
                                                        <Select defaultValue={company.verification_status}>
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
                                <Button type="button" variant="outline" onClick={() => router.get(route('admin.dashboard'))}>Cancel</Button>
                                <Button type="submit">Save</Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </AppLayout >
    )
}
