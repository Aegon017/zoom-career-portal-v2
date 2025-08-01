import {
    Mail, Phone, Briefcase, CalendarDays, MapPin,
    FileText, BookOpen, ShieldCheck,
    Languages, SquareUser, Star, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import AppLayout from '@/layouts/employer-layout';
import { Head } from '@inertiajs/react';
import { format, formatDate } from 'date-fns';
import { Resume, User } from '@/types';

export default function Profile( { user, resume }: { user: User, resume: Resume } ) {
    const getInitials = useInitials();
    return (
        <AppLayout>
            <Head title={ `${ user.name }'s Profile` } />
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="relative mb-16">
                    <div className="h-36 bg-gradient-to-r from-orange-700 to-blue-950 rounded-t-xl" />
                    <div className="absolute -bottom-20 md:-bottom-16 left-6 flex items-end">
                        <div className="relative">
                            <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                                <AvatarImage src={ user.avatar_url } alt={ user.name } />
                                <AvatarFallback className="text-3xl">
                                    { getInitials( user.name ) }
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="ml-6 mb-2">
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl font-bold text-foreground">{ user.name }</h1>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                                <span className="text-md md:text-lg text-foreground">
                                    { user.profile?.job_title }
                                </span>
                            </div>

                            <div className="mt-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <CalendarDays className="h-4 w-4" />
                                    Profile last updated - { format( new Date( user.profile?.updated_at ?? "" ), 'dd MMM yyyy' ) }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-20">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Users className="h-5 w-5" />
                                    <span>Summary</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-foreground leading-relaxed">
                                    { user.profile?.summary }
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <FileText className="h-5 w-5" />
                                    <span>Resume</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between bg-muted rounded-lg p-4">
                                    <div>
                                        <div className="font-medium text-foreground">
                                            { resume?.media[ 0 ].name }
                                        </div>
                                        <div className="text-sm text-muted-foreground mt-1">
                                            { format( new Date( resume?.updated_at ?? "" ), 'dd MMM yyyy' ) }
                                        </div>
                                    </div>
                                    <a href={ resume?.resume_url ? resume?.resume_url : '' }>
                                        <Button variant="outline">
                                            <FileText className="h-4 w-4 mr-2" /> View
                                        </Button>
                                    </a>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Star className="h-5 w-5" />
                                    <span>Skills</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    { user.skills?.map( ( skill ) => (
                                        <Badge
                                            key={ skill.id }
                                            variant="secondary"
                                            className="px-3 py-1.5 text-sm font-medium bg-primary/10 text-primary"
                                        >
                                            { skill.name }
                                        </Badge>
                                    ) ) }
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Briefcase className="h-5 w-5" />
                                    <span>Employment</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                { user.work_experiences?.map( ( workExperience, index ) => (
                                    <div key={ index }>
                                        <div className="flex justify-between">
                                            <h4 className="font-semibold text-lg text-foreground">{ workExperience?.title }</h4>
                                            <span className="text-muted-foreground text-sm">
                                                { workExperience?.start_date ? format( new Date( workExperience?.start_date ), 'MMM yyyy' ) : '-' } –{ ' ' }
                                                { workExperience?.is_current ? 'Present' : workExperience?.end_date ? format( new Date( workExperience?.end_date ), 'MMM yyyy' ) : '-' }
                                            </span>
                                        </div>
                                        <div className="text-foreground mt-1">
                                            { workExperience?.company_name ?? workExperience?.company.name }
                                        </div>
                                        { index < user.work_experiences.length - 1 && <Separator className="my-4" /> }
                                    </div>
                                ) ) }
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <BookOpen className="h-5 w-5" />
                                    <span>Education</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                { user.educations?.map( ( education, index ) => (
                                    <div key={ index }>
                                        <div className="flex justify-between">
                                            <h4 className="font-semibold text-lg text-foreground">{ education.course_title }</h4>
                                            <span className="text-muted-foreground text-sm">
                                                { education.start_date
                                                    ? education.is_current
                                                        ? `${ new Date( education.start_date ).getFullYear() } - Present`
                                                        : education.end_date
                                                            ? `${ new Date( education.start_date ).getFullYear() } - ${ new Date( education.end_date ).getFullYear() }`
                                                            : `${ new Date( education.start_date ).getFullYear() } - -`
                                                    : '-' }
                                            </span>
                                        </div>
                                        <div className="text-foreground mt-1">
                                            { education.institution }
                                        </div>
                                        <div className="mt-2">
                                            <Badge variant="outline" className="border-primary text-primary">
                                                { education.course_type }
                                            </Badge>
                                        </div>
                                        { index < user.educations.length - 1 && <Separator className="my-4" /> }
                                    </div>
                                ) ) }
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <SquareUser className="h-5 w-5" />
                                    <span>Personal Details</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Gender</h4>
                                        <p className="font-medium text-foreground">{ user.personal_detail?.gender }</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Date of Birth</h4>
                                        <p className="font-medium text-foreground">
                                            { user.personal_detail?.date_of_birth ? format( new Date( user.personal_detail.date_of_birth ), 'dd MMM yyyy' ) : null }
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Address</h4>
                                        <p className="font-medium text-foreground">
                                            { user.address?.location?.full_name }
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Marital Status</h4>
                                        <p className="font-medium text-foreground">{ user.personal_detail?.marital_status }</p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Work Permit</h4>
                                        <p className="font-medium text-foreground">
                                            { user.work_permits?.map( ( wp ) => wp.country ).join( ', ' ) }
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Differently Abled</h4>
                                        <p className="font-medium text-foreground">
                                            { user.personal_detail?.differently_abled ? 'Yes' : 'No' }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Users className="h-5 w-5" />
                                    <span>Contact</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-lg">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="text-sm text-muted-foreground">Email</h4>
                                        <p className="font-medium text-foreground break-words whitespace-normal">
                                            { user.email }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-lg">
                                        <Phone className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Phone</h4>
                                        <p className="font-medium text-foreground">{ user.phone }</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-lg">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Location</h4>
                                        <p className="font-medium text-foreground">
                                            { user.address?.location?.full_name }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-lg">
                                        <Briefcase className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Experience</h4>
                                        <p className="font-medium text-foreground">
                                            { user.profile?.experience }
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-muted p-2 rounded-lg">
                                        <CalendarDays className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm text-muted-foreground">Notice Period</h4>
                                        <p className="font-medium text-foreground">
                                            { user.profile?.notice_period }
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <Languages className="h-5 w-5" />
                                    <span>Languages</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    { user.user_languages?.map( ( userLanguage ) => (
                                        <div key={ userLanguage.id }>
                                            <div className="font-medium text-foreground">{ userLanguage?.language.name }</div>
                                            <div className="flex items-center gap-4 mt-1">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <span>{ userLanguage?.proficiency }</span>
                                                    { userLanguage.can_read && (
                                                        <>
                                                            <Separator orientation="vertical" className="h-4 bg-muted-foreground" />
                                                            <span>Read</span>
                                                        </>
                                                    ) }
                                                    { userLanguage.can_write && (
                                                        <>
                                                            <Separator orientation="vertical" className="h-4 bg-muted-foreground" />
                                                            <span>Write</span>
                                                        </>
                                                    ) }
                                                    { userLanguage.can_speak && (
                                                        <>
                                                            <Separator orientation="vertical" className="h-4 bg-muted-foreground" />
                                                            <span>Speak</span>
                                                        </>
                                                    ) }
                                                </div>
                                            </div>
                                        </div>
                                    ) ) }
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <ShieldCheck className="h-5 w-5" />
                                    <span>Certifications</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    { user.certificates?.map( ( certificate ) => (
                                        <div key={ certificate.id }>
                                            <div className="font-medium text-foreground">{ certificate?.name }</div>
                                        </div>
                                    ) ) }
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}