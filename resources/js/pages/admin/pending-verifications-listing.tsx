import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Check, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface VerificationItem {
    message: string;
    url: string;
    id: string;
}

interface Props {
    pendingVerifications: VerificationItem[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Pending Verifications', href: '/admin/pending-verifications' },
];

const PendingVerifications = ( { pendingVerifications }: Props ) => {
    const hasVerifications = pendingVerifications.length > 0;

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
                    { hasVerifications && (
                        <Badge variant="secondary" className="px-2.5 py-1">
                            { pendingVerifications.length } pending
                        </Badge>
                    ) }
                </div>
                <p className="text-muted-foreground pl-11">
                    Review and approve verification requests
                </p>

                <Card className="overflow-hidden p-0">
                    <CardContent className="p-0">
                        { hasVerifications ? (
                            <ol className="divide-y">
                                { pendingVerifications.map( ( item, index ) => (
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
                        ) : (
                            <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
                                <div className="bg-primary/10 p-4 rounded-full">
                                    <Check className="h-10 w-10 text-primary" />
                                </div>
                                <h3 className="text-xl font-medium text-foreground">All caught up!</h3>
                                <p className="text-muted-foreground max-w-md">
                                    No pending verification requests at this time. Check back later.
                                </p>
                            </div>
                        ) }
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
};

export default PendingVerifications;
