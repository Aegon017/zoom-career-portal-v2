import { AppHeader } from "@/components/app-header";
import { Company } from "@/types";
import { Head } from "@inertiajs/react";
import { cp } from "fs";
import { Loader, LoaderPinwheel } from "lucide-react";

const RequestPending = ({ company }: { company: Company }) => {
    return (
        <>
            <Head title="Company register" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="md:w-xl flex flex-col items-center text-center">
                    <div className="w-32 h-32 mb-6">
                        <LoaderPinwheel className="animate-spin text-orange-400 w-full h-full duration-3000" />
                    </div>

                    <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                        Your request to join {company.company_name} is under review
                    </h1>

                    <p className="text-gray-700 max-w-xl mb-4">
                        Your request to join {company.company_name} as a member
                        has been sent. We'll send you an email as soon as you're approved.
                    </p>

                    <p className="text-sm text-gray-600">
                        If you made this request accidentally, you can{" "}
                        <a href="#" className="text-blue-600 underline hover:text-blue-800">
                            cancel the request
                        </a>
                        .
                    </p>
                </div>
            </div>
        </>
    );
};

export default RequestPending;
