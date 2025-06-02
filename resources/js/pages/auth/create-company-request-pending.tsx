import { AppHeader } from "@/components/app-header"
import { Head } from "@inertiajs/react"
import { LoaderPinwheel, CheckCircle2, Clock } from "lucide-react"

const RequestPending = () => {
    return (
        <>
            <Head title="Company Verification" />
            <AppHeader />
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="w-full max-w-4xl space-y-10 text-center">

                    {/* Loader & Icons Circle */}
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 animate-pulse opacity-60" />
                        <div className="absolute inset-2 rounded-full border-2 border-orange-200" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <LoaderPinwheel className="w-8 h-8 md:w-20 md:h-20 text-orange-500 animate-spin drop-shadow-sm" />
                        </div>
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 animate-bounce delay-300">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 animate-bounce delay-700">
                            <Clock className="w-4 h-4 text-blue-600" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text">
                            Company Verification Request Received
                        </h1>
                        <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-orange-400 to-amber-400" />
                    </div>

                    {/* Message Box */}
                    <div className="space-y-6 rounded-2xl border border-white/20 bg-white/80 p-8 md:p-10 shadow-xl backdrop-blur-sm text-left">
                        <div className="space-y-5 text-base sm:text-lg md:text-xl leading-relaxed text-gray-700">
                            <p className="text-base font-semibold text-gray-800">
                                Thank you for submitting your company verification request.
                            </p>
                            <p className="text-sm">
                                We've received your details and our team is currently reviewing your information to verify your company profile.
                            </p>
                            <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                                <p className="text-sm">
                                    This process typically takes{" "}
                                    <span className="inline-block rounded-md bg-orange-100 px-2 py-1 font-semibold text-orange-700">
                                        1–3 business days
                                    </span>
                                    . You'll receive an email once verification is complete or if we need additional details.
                                </p>
                            </div>
                            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                <p>
                                    <span className="mb-2 flex items-center gap-2 font-semibold text-blue-800 text-sm">
                                        <Clock className="w-4 h-4" />
                                        Important Note:
                                    </span>
                                    <span className="text-blue-700 text-sm">
                                        Please ensure your contact details are up to date so we can reach you without delays.
                                    </span>
                                </p>
                            </div>
                            <p className="italic text-gray-600 text-sm">
                                We appreciate your patience and look forward to welcoming you as a verified member of our platform.
                            </p>
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-center space-x-4 pt-4">
                        <div className="flex space-x-2">
                            <div className="h-3 w-3 animate-pulse rounded-full bg-orange-400" />
                            <div className="h-3 w-3 animate-pulse rounded-full bg-orange-300 delay-150" />
                            <div className="h-3 w-3 animate-pulse rounded-full bg-orange-200 delay-300" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                            Processing your request
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RequestPending
