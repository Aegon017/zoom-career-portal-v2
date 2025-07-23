import { AppHeader } from '@/components/employer/employer-header';
import { Head } from '@inertiajs/react';
import { CheckCircle2, Clock, LoaderPinwheel } from 'lucide-react';

const SetupCompanyVerificationPending = () => {
    return (
        <>
            <Head title="Setup company verification pending" />
            <AppHeader />
            <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6 py-16">
                <div className="w-full max-w-4xl space-y-10 text-center">
                    {/* Loader & Icons Circle */}
                    <div className="relative mx-auto h-24 w-24">
                        <div className="bg-primary/10 absolute inset-0 animate-pulse rounded-full" />
                        <div className="border-primary/20 absolute inset-2 rounded-full border-2" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <LoaderPinwheel className="text-primary h-8 w-8 animate-spin md:h-20 md:w-20" />
                        </div>
                        <div className="bg-success/20 absolute -top-2 -right-2 flex h-6 w-6 animate-bounce items-center justify-center rounded-full delay-300">
                            <CheckCircle2 className="text-success h-4 w-4" />
                        </div>
                        <div className="bg-secondary/20 absolute -bottom-2 -left-2 flex h-6 w-6 animate-bounce items-center justify-center rounded-full delay-700">
                            <Clock className="text-secondary h-4 w-4" />
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-4">
                        <h1 className="text-foreground font-bold md:text-4xl">Company Verification Request Received</h1>
                        <div className="bg-primary mx-auto h-1 w-24 rounded-full" />
                    </div>

                    {/* Message Box */}
                    <div className="bg-card space-y-6 rounded-2xl border p-8 shadow-xl md:p-10">
                        <div className="text-card-foreground space-y-5 text-base leading-relaxed sm:text-lg md:text-xl">
                            <p className="text-base font-semibold">Thank you for submitting your company verification request.</p>
                            <p className="text-sm">
                                We've received your details and our team is currently reviewing your information to verify your company profile.
                            </p>
                            <div className="bg-primary/10 rounded-xl border p-4 text-left">
                                <p className="text-sm">
                                    This process typically takes{' '}
                                    <span className="bg-primary/10 text-primary inline-block rounded-md px-2 py-1 font-semibold">
                                        1–3 business days
                                    </span>
                                    . You'll receive an email once verification is complete or if we need additional details.
                                </p>
                            </div>
                            <div className="bg-secondary rounded-xl border p-4">
                                <p className="text-left">
                                    <span className="text-primary mb-2 flex items-center gap-2 text-sm font-semibold">
                                        <Clock className="h-4 w-4" />
                                        Important Note:
                                    </span>
                                    <span className="text-secondary-foreground text-sm">
                                        Please ensure your contact details are up to date so we can reach you without delays.
                                    </span>
                                </p>
                            </div>
                            <p className="text-muted-foreground text-sm italic">
                                We appreciate your patience and look forward to welcoming you as a verified member of our platform.
                            </p>
                        </div>
                    </div>

                    {/* Status Indicator */}
                    <div className="flex items-center justify-center space-x-4 pt-4">
                        <div className="flex space-x-2">
                            <div className="bg-primary h-3 w-3 animate-pulse rounded-full" />
                            <div className="bg-primary/70 h-3 w-3 animate-pulse rounded-full delay-150" />
                            <div className="bg-primary/40 h-3 w-3 animate-pulse rounded-full delay-300" />
                        </div>
                        <span className="text-muted-foreground text-sm font-medium">Processing your request</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SetupCompanyVerificationPending;
