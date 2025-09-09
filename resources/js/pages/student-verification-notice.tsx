import { Button } from "@/components/ui/button";
import { Head, Link } from "@inertiajs/react";

export default function StudentVerificationNotice() {
	return (
		<>
			<Head title="Verification Pending" />
			<div className="bg-muted flex min-h-screen items-center justify-center px-4">
				<div className="w-full max-w-lg space-y-6 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-xl md:p-10">
					<div className="space-y-3">
						<h1 className="text-3xl font-bold text-gray-900">
							Verification Pending
						</h1>
						<p className="text-gray-700">
							Thank you for registering! Your account is currently under review
							by our administrators. Once your details are verified, you’ll be
							able to access job opportunities in the portal.
						</p>
						<p className="text-muted-foreground text-sm">
							This process might take a little time. We appreciate your
							patience. If you’ve already been verified, you can proceed to your
							dashboard below.
						</p>
					</div>

					<Button asChild className="w-full sm:w-auto">
						<Link href="/jobseeker/dashboard">Go to Dashboard</Link>
					</Button>
				</div>
			</div>
		</>
	);
}
