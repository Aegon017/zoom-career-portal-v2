import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Head } from "@inertiajs/react";

const VerificationNotice = () => {
    const handleContactSupport = () => {
        window.location.href = "mailto:support@yourdomain.com";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <Head title="Verification notice" />
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center">
                    <ShieldAlert className="mx-auto mb-4 text-yellow-500" size={40} />
                    <CardTitle className="text-xl font-semibold">
                        Account Not Verified
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                    <p className="text-gray-600">
                        Your account is pending verification by the administrator.
                    </p>
                    <p className="text-gray-600">
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