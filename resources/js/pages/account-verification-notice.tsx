import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Head } from "@inertiajs/react";

const VerificationNotice = () => {
    const handleContactSupport = () => {
        window.location.href = "mailto:support@yourdomain.com";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted px-4">
            <Head title="Verification Notice" />
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-col items-center text-center space-y-2">
                    <ShieldAlert className="text-yellow-500" size={40} aria-hidden="true" />
                    <CardTitle className="text-xl font-semibold">
                        Account Not Verified
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-muted-foreground">
                        Your account is pending verification by the administrator.
                    </p>
                    <p className="text-muted-foreground">
                        Please contact the admin to verify and activate your account.
                    </p>
                    <Button onClick={handleContactSupport} variant="outline" className="w-full">
                        Contact Admin
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default VerificationNotice;
