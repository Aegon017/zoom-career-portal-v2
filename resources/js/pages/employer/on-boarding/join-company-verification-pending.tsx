import { AppHeader } from "@/components/app-header"
import { Company } from "@/types"
import { Head } from "@inertiajs/react"
import { Building2, Clock, LoaderPinwheel, Mail } from "lucide-react"

const JoinCompanyVerificationPending = (company: Company) => {
    return (
        <>
            <Head title="Join company verification pending" />
            <AppHeader />
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-gradient-to-br from-slate-50 via-white to-blue-50">
                <div className="w-full max-w-4xl space-y-10 text-center">

                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-100 to-amber-100 animate-pulse opacity-60" />
                        <div className="absolute inset-2 rounded-full border-2 border-orange-200" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <LoaderPinwheel className="w-8 h-8 md:w-20 md:h-20 text-orange-500 animate-spin drop-shadow-sm" />
                        </div>
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-green-100 animate-bounce delay-300">
                            <Building2 className="w-4 h-4 text-green-600" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 animate-bounce delay-700">
                            <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="absolute top-1/2 -left-5 flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 animate-bounce delay-500">
                            <Clock className="w-4 h-4 text-purple-700" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text leading-tight tracking-tight">
                            Request Under Review
                        </h1>
                        <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-orange-400 to-amber-400" />
                    </div>

                    <div className="space-y-6 rounded-2xl border border-white/20 bg-white/80 p-8 md:p-10 shadow-xl backdrop-blur-sm text-left max-w-2xl mx-auto">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-orange-200 to-amber-200 flex items-center justify-center">
                                <Building2 className="w-7 h-7 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{company.company_name}</h2>
                                <p className="text-sm text-gray-700 uppercase tracking-wide">Company</p>
                            </div>
                        </div>
                        <div className="rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 p-4">
                            <p className="text-orange-700 font-semibold text-base">
                                Your membership request is currently being reviewed.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 max-w-3xl mx-auto text-gray-700 leading-relaxed">
                        <p className="text-base md:text-lg font-semibold text-gray-900">
                            Your request to join <span className="font-bold text-gray-900">{company.company_name}</span> has been submitted successfully.
                        </p>

                        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                            <p className="text-green-700 text-sm md:text-base text-left">
                                <span className="mb-2 flex gap-2 font-semibold">
                                    <Mail className="w-4 h-4" />
                                    What happens next?
                                </span>
                                We will notify you by email once your membership is approved by the company administrator.
                            </p>
                        </div>

                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-blue-700 text-sm md:text-base text-left">
                                <span className="mb-2 flex gap-2 font-semibold">
                                    <Clock className="w-4 h-4" />
                                    Review Timeline:
                                </span>
                                Most requests are reviewed within 1–3 business days.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center space-x-4 pt-4">
                        <div className="flex space-x-2">
                            <div className="h-3 w-3 animate-pulse rounded-full bg-orange-400" />
                            <div className="h-3 w-3 animate-pulse rounded-full bg-orange-300 delay-150" />
                            <div className="h-3 w-3 animate-pulse rounded-full bg-orange-200 delay-300" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Processing your request</span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JoinCompanyVerificationPending