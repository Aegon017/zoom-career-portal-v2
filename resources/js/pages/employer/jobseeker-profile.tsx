import { format } from "date-fns";
import { Head } from "@inertiajs/react";
import { BreadcrumbItem, User } from "@/types";
import AppLayout from "@/layouts/employer-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useInitials } from "@/hooks/use-initials";
import { Button } from "@/components/ui/button";
import { Mail, Phone, UserPlus, Users } from "lucide-react";
import MessageButton from "@/components/message-button";

interface Props {
    user: User;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jobseekers',
        href: '/employer/jobseekers'
    },
    {
        title: 'Profile',
        href: ''
    }
];


const JobseekerProfile = ( { user }: Props ) => {
    const getInitials = useInitials();

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Profile" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                    {/* Hero Section */ }
                    <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="relative max-w-6xl mx-auto px-6 py-12">
                            <div className="flex flex-col md:flex-row items-start gap-8">
                                <div className="relative">
                                    <Avatar className="w-32 h-32 border-4 border-white shadow-2xl">
                                        <AvatarImage src={ user.avatar_url || "/placeholder.svg" } />
                                        <AvatarFallback className="text-2xl bg-white text-slate-800">{ getInitials( user.name ) }</AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div>
                                        <h1 className="text-4xl font-bold mb-2">{ user.name }</h1>
                                        { user.profile?.job_title && (
                                            <p className="text-xl text-blue-100 font-medium">{ user.profile.job_title }</p>
                                        ) }
                                    </div>

                                    {/* <div className="flex flex-wrap gap-4 text-sm">
                                        { user.profile?.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{ user.profile.location }</span>
                                            </div>
                                        ) }
                                        { user.profile?.updated_at && (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Updated { format( new Date( user.profile.updated_at ), "dd MMM yyyy" ) }</span>
                                            </div>
                                        ) }
                                    </div> */}

                                    <div className="flex flex-wrap gap-3">
                                        <MessageButton userId={ user.id }>
                                            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                                                <Mail className="w-4 h-4 mr-2" />
                                                Message
                                            </Button>
                                        </MessageButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-6xl mx-auto px-6 py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */ }
                            <div className="lg:col-span-2 space-y-6">
                                {/* Stats Cards */ }
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">{ user.followers?.length.toLocaleString() }</div>
                                        <div className="text-sm text-muted-foreground">Followers</div>
                                    </Card>
                                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                                        <div className="text-3xl font-bold text-purple-600 mb-1">
                                            { ( ( user.followingUsers?.length ?? 0 ) + ( user.followingCompanies?.length ?? 0 ) ).toLocaleString() }
                                        </div>
                                        <div className="text-sm text-muted-foreground">Following</div>
                                    </Card>
                                    <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                                        <div className="text-3xl font-bold text-indigo-600 mb-1">{ user.skills?.length || 0 }</div>
                                        <div className="text-sm text-muted-foreground">Skills</div>
                                    </Card>
                                </div>

                                {/* About Section */ }
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <Users className="w-5 h-5 text-blue-600" />
                                            About
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground leading-relaxed">
                                            { user.profile?.summary || "No summary available." }
                                        </p>
                                    </CardContent>
                                </Card>

                                {/* Skills Section */ }
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-xl">Skills & Expertise</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        { user.skills?.length ? (
                                            <div className="flex flex-wrap gap-2">
                                                { user.skills.map( ( skill ) => (
                                                    <Badge
                                                        key={ skill.id }
                                                        variant="secondary"
                                                        className="px-3 py-1 text-sm hover:bg-blue-100 hover:text-blue-800 transition-colors cursor-pointer"
                                                    >
                                                        { skill.name }
                                                    </Badge>
                                                ) ) }
                                            </div>
                                        ) : (
                                            <p className="text-muted-foreground">No skills added yet.</p>
                                        ) }
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */ }
                            <div className="space-y-6">
                                {/* Contact Information */ }
                                <Card className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <CardTitle className="text-lg">Contact Information</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        { user.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">{ user.email }</span>
                                            </div>
                                        ) }
                                        { user.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-sm">{ user.phone }</span>
                                            </div>
                                        ) }
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default JobseekerProfile