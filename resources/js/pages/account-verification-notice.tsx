import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Head } from "@inertiajs/react";
import { ShieldAlert } from "lucide-react";

const VerificationNotice = () => {
	const handleContactSupport = () => {
		window.location.href = "mailto:support@yourdomain.com";
	};

	return (
		<div className="bg-muted flex min-h-screen items-center justify-center px-4">
			<Head title="Verification Notice" />
			<Card className="w-full max-w-md">
				<CardHeader className="flex flex-col items-center space-y-2 text-center">
					<ShieldAlert
						className="text-yellow-500"
						size={40}
						aria-hidden="true"
					/>
					<CardTitle className="text-xl font-semibold">
						Account Not Verified
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 text-center">
					<p className="text-muted-foreground">
						Your account is pending verification by the administrator.
					</p>
					<p className="text-muted-foreground">
						Please contact the admin to verify and activate your account.
					</p>
					<Button
						onClick={handleContactSupport}
						variant="outline"
						className="w-full"
					>
						Contact Admin
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default VerificationNotice;
