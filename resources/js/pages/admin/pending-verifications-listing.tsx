import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Check, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface VerificationItem {
    message: string;
    url: string;
    id: string;
}

interface VerificationCategory {
    count: number;
    items: VerificationItem[];
}

interface Props {
    pendingVerifications: {
        company: VerificationCategory;
        student: VerificationCategory;
        employer: VerificationCategory;
        job: VerificationCategory;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pending Verifications', href: '/admin/pending-verifications' },
];

const PendingVerifications = ( { pendingVerifications }: Props ) => {
    const totalCount = Object.values( pendingVerifications ).reduce(
        ( total, category ) => total + category.count, 0
    );

    const VerificationList = ( { items }: { items: VerificationItem[] } ) => {
        if ( items.length === 0 ) {
            return (
                <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                    <div className="bg-primary/10 p-4 rounded-full">
                        <Check className="h-10 w-10 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium text-foreground">All caught up!</h3>
                    <p className="text-muted-foreground max-w-md">
                        No pending verification requests at this time. Check back later.
                    </p>
                </div>
            );
        }

        return (
            <ol className="divide-y">
                { items.map( ( item, index ) => (
                    <li key={ item.id } className="transition-colors hover:bg-muted/30">
                        <a
                            href={ item.url }
                            className="flex items-center justify-between p-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                                    { index + 1 }
                                </div>
                                <p className="font-medium text-foreground">{ item.message }</p>
                            </div>
                            <Button variant="outline" size="sm" className="gap-2">
                                Review
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </a>
                    </li>
                ) ) }
            </ol>
        );
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title="Pending Verifications" />
            <div className="flex flex-col gap-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Check className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-semibold text-foreground">
                        Pending Verifications
                    </h1>
                    { totalCount > 0 && (
                        <Badge variant="secondary" className="px-2.5 py-1">
                            { totalCount } pending
                        </Badge>
                    ) }
                </div>
                <p className="text-muted-foreground pl-11">
                    Review and approve verification requests
                </p>

                <Tabs defaultValue="company">
                    <TabsList>
                        <TabsTrigger value="company" className="flex gap-2">
                            Company
                            { pendingVerifications.company.count > 0 && (
                                <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                                    { pendingVerifications.company.count }
                                </Badge>
                            ) }
                        </TabsTrigger>
                        <TabsTrigger value="student" className="flex gap-2">
                            Student
                            { pendingVerifications.student.count > 0 && (
                                <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                                    { pendingVerifications.student.count }
                                </Badge>
                            ) }
                        </TabsTrigger>
                        <TabsTrigger value="employer" className="flex gap-2">
                            Employer
                            { pendingVerifications.employer.count > 0 && (
                                <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                                    { pendingVerifications.employer.count }
                                </Badge>
                            ) }
                        </TabsTrigger>
                        <TabsTrigger value="job" className="flex gap-2">
                            Job
                            { pendingVerifications.job.count > 0 && (
                                <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
                                    { pendingVerifications.job.count }
                                </Badge>
                            ) }
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="company">
                        <Card className="overflow-hidden p-0">
                            <CardContent className="p-0">
                                <VerificationList items={ pendingVerifications.company.items } />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="student">
                        <Card className="overflow-hidden p-0">
                            <CardContent className="p-0">
                                <VerificationList items={ pendingVerifications.student.items } />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="employer">
                        <Card className="overflow-hidden p-0">
                            <CardContent className="p-0">
                                <VerificationList items={ pendingVerifications.employer.items } />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="job">
                        <Card className="overflow-hidden p-0">
                            <CardContent className="p-0">
                                <VerificationList items={ pendingVerifications.job.items } />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default PendingVerifications;