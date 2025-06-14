import { AppHeader } from "@/components/employer/employer-header"
import { Head } from '@inertiajs/react'
import { CheckCircle2, Clock, LoaderPinwheel } from 'lucide-react'

const SetupCompanyVerificationPending = () => {
    return (
        <>
            <Head title="Setup company verification pending" />
            <AppHeader />
            <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16 bg-background">
                <div className="w-full max-w-4xl space-y-10 text-center">

                    {/* Loader & Icons Circle */}
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                        <div className="absolute inset-2 rounded-full border-2 border-primary/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <LoaderPinwheel className="w-8 h-8 md:w-20 md:h-20 text-primary animate-spin" />
                        </div>
                        <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-success/20 animate-bounce delay-300">
                            <CheckCircle2 className="w-4 h-4 text-success" />
                        </div>
                        <div className="absolute -bottom-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 animate-bounce delay-700">
                            <Clock className="w-4 h-4 text-secondary" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="md:text-4xl font-bold text-foreground">
                            Company Verification Request Received
                        </h1>
                        <div className="mx-auto h-1 w-24 rounded-full bg-primary" />
                    </div>

                    {/* Message Box */}
                    <div className="space-y-6 rounded-2xl border bg-card p-8 md:p-10 shadow-xl">
                        <div className="space-y-5 text-base sm:text-lg md:text-xl leading-relaxed text-card-foreground">
                            <p className="text-base font-semibold">
                                Thank you for submitting your company verification request.
                            </p>
                            <p className="text-sm">
                                We've received your details and our team is currently reviewing your information to verify your company profile.
                            </p>
                            <div className="rounded-xl border bg-primary/10 p-4 text-left">
                                <p className="text-sm">
                                    This process typically takes{" "}
                                    <span className="inline-block rounded-md bg-primary/10 px-2 py-1 font-semibold text-primary">
                                        1–3 business days
                                    </span>
                                    . You'll receive an email once verification is complete or if we need additional details.
                                </p>
                            </div>
                            <div className="rounded-xl border bg-secondary p-4">
                                <p className="text-left">
                                    <span className="mb-2 flex items-center gap-2 font-semibold text-primary text-sm">
                                        <Clock className="w-4 h-4" />
                                        Important Note:
                                    </span>
                                    <span className="text-secondary-foreground text-sm">
                                        Please ensure your contact details are up to date so we can reach you without delays.
                                    </span>
                                </p>
                            </div>
                            <p className="italic text-muted-foreground text-sm">
                                We appreciate your patience and look forward to welcoming you as a verified member of our platform.
                            </p>
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-center space-x-4 pt-4">
                        <div className="flex space-x-2">
                            <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                            <div className="h-3 w-3 animate-pulse rounded-full bg-primary/70 delay-150" />
                            <div className="h-3 w-3 animate-pulse rounded-full bg-primary/40 delay-300" />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground">
                            Processing your request
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SetupCompanyVerificationPending