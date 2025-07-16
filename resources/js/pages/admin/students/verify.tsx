import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export default function Verify( { student }: { student: any } ) {
    const handleVerify = () => {
        router.post( `/admin/students/verify/${ student.id }` );
    };

    const handleReject = () => {
        router.delete( `/admin/students/reject/${ student.id }` );
    };

    return (
        <AppLayout>
            <Head title="Verify Student" />
            <div className="max-w-4xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Verification</h1>
                <p className="text-gray-600 mb-6">
                    Please review the submitted details before approving or rejecting this student registration.
                </p>

                <Separator className="mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <div>
                        <p className="text-gray-500 font-medium">Full Name</p>
                        <p className="text-base text-gray-900">{ student.name }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Email Address</p>
                        <p className="text-base text-gray-900">{ student.email }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Phone Number</p>
                        <p className="text-base text-gray-900">{ student.phone || '-' }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Course Completed</p>
                        <p className="text-base text-gray-900">{ student.profile.course_completed }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Student ID</p>
                        <p className="text-base text-gray-900">{ student.profile.student_id }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Completed Month</p>
                        <p className="text-base text-gray-900">{ student.profile.completed_month }</p>
                    </div>
                    <div>
                        <p className="text-gray-500 font-medium">Verification Status</p>
                        <Badge variant={ student.profile.is_verified ? 'outline' : 'default' }>
                            { student.profile.is_verified ? 'Verified' : 'Pending' }
                        </Badge>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row justify-end gap-4">
                    <Button variant="destructive" onClick={ handleReject }>
                        Reject Registration
                    </Button>
                    <Button onClick={ handleVerify }>Approve & Verify</Button>
                </div>
            </div>
        </AppLayout>
    );
}
