import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';

export default function Verify({ student }: { student: any }) {
    const handleVerify = () => {
        router.post(`/admin/students/verify/${student.id}`);
    };

    const handleReject = () => {
        router.delete(`/admin/students/reject/${student.id}`);
    };

    return (
        <AppLayout>
            <Head title="Verify Student" />
            <div className="mx-auto max-w-4xl px-4 py-10">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">Student Verification</h1>
                <p className="mb-6 text-gray-600">Please review the submitted details before approving or rejecting this student registration.</p>

                <Separator className="mb-6" />

                <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-2">
                    <div>
                        <p className="font-medium text-gray-500">Full Name</p>
                        <p className="text-base text-gray-900">{student.name}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Email Address</p>
                        <p className="text-base text-gray-900">{student.email}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Phone Number</p>
                        <p className="text-base text-gray-900">{student.phone || '-'}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Course Completed</p>
                        <p className="text-base text-gray-900">{student.profile.course_completed}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Student ID</p>
                        <p className="text-base text-gray-900">{student.profile.student_id}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Completed Month</p>
                        <p className="text-base text-gray-900">{student.profile.completed_month}</p>
                    </div>
                    <div>
                        <p className="font-medium text-gray-500">Verification Status</p>
                        <Badge variant={student.profile.is_verified ? 'outline' : 'default'}>
                            {student.profile.is_verified ? 'Verified' : 'Pending'}
                        </Badge>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col justify-end gap-4 sm:flex-row">
                    <Button variant="destructive" onClick={handleReject}>
                        Reject Registration
                    </Button>
                    <Button onClick={handleVerify}>Approve & Verify</Button>
                </div>
            </div>
        </AppLayout>
    );
}
