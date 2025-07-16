import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Icon } from 'lucide-react';

export default function StudentVerificationNotice() {
    return (
        <>
            <Head title="Verification Pending" />
            <div className="min-h-screen flex items-center justify-center px-4 bg-muted">
                <div className="w-full max-w-lg bg-white shadow-xl rounded-xl p-8 md:p-10 space-y-6 text-center border border-gray-200">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-bold text-gray-900">Verification Pending</h1>
                        <p className="text-gray-700">
                            Thank you for registering! Your account is currently under review by our administrators.
                            Once your details are verified, you’ll be able to access job opportunities in the portal.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            This process might take a little time. We appreciate your patience.
                            If you’ve already been verified, you can proceed to your dashboard below.
                        </p>
                    </div>

                    <Button asChild className="w-full sm:w-auto">
                        <Link href="/jobseeker/explore">
                            Go to Dashboard
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}
