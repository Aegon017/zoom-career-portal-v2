import { AppHeader } from "@/components/employer/employer-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Company } from "@/types"
import { Head } from "@inertiajs/react"
import { Building2, Clock, CheckCircle, Mail, Sparkles } from "lucide-react"

const JoinCompanyVerificationPending = ( { company }: { company: Company } ) => {
    return (
        <>
            <Head title="Join Company Verification Pending" />
            <AppHeader />
            <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-muted/40">
                <div className="flex flex-col items-center justify-center min-h-screen px-6 py-16">
                    <div className="w-full max-w-4xl space-y-12 text-center">
                        {/* Animated Loader Section */ }
                        <div className="relative mx-auto w-32 h-32">
                            {/* Outer rotating rings */ }
                            <div
                                className="absolute inset-0 rounded-full border-4 border-muted animate-spin"
                                style={ { animationDuration: "3s" } }
                            />
                            <div
                                className="absolute inset-2 rounded-full border-2 border-dashed border-muted-foreground/30 animate-spin"
                                style={ { animationDuration: "2s", animationDirection: "reverse" } }
                            />

                            {/* Center icon */ }
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                    <CheckCircle className="w-8 h-8 text-primary-foreground animate-pulse" />
                                </div>
                            </div>

                            {/* Floating icons */ }
                            <div
                                className="absolute -top-3 -right-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 shadow-lg animate-bounce"
                                style={ { animationDelay: "0.2s" } }
                            >
                                <Building2 className="w-4 h-4 text-white" />
                            </div>
                            <div
                                className="absolute -bottom-3 -left-3 flex h-8 w-8 items-center justify-center rounded-full bg-violet-500 shadow-lg animate-bounce"
                                style={ { animationDelay: "0.6s" } }
                            >
                                <Mail className="w-4 h-4 text-white" />
                            </div>
                            <div
                                className="absolute top-1/2 -left-6 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 shadow-lg animate-bounce"
                                style={ { animationDelay: "0.4s" } }
                            >
                                <Clock className="w-4 h-4 text-white" />
                            </div>
                            <div
                                className="absolute top-1/2 -right-6 flex h-8 w-8 items-center justify-center rounded-full bg-pink-500 shadow-lg animate-bounce"
                                style={ { animationDelay: "0.8s" } }
                            >
                                <Sparkles className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        {/* Header Section */ }
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">Request Under Review</h1>
                                <div className="mx-auto h-1.5 w-32 rounded-full bg-primary" />
                            </div>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                                Your membership request has been submitted successfully and is currently being processed.
                            </p>
                        </div>

                        {/* Company Card */ }
                        <div className="max-w-2xl mx-auto">
                            <Card className="border-border/60 bg-card/80 backdrop-blur-sm shadow-xl">
                                <CardContent className="p-8 md:p-10">
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                                            <Building2 className="w-8 h-8 text-primary-foreground" />
                                        </div>
                                        <div className="text-left">
                                            <h2 className="text-2xl font-bold text-card-foreground mb-1">{ company.name }</h2>
                                            <Badge variant="secondary" className="text-xs font-medium uppercase tracking-wider">
                                                Company
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
                                        <p className="text-primary font-semibold text-base leading-relaxed">
                                            Your membership request is currently being reviewed by the company administrator.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Information Cards */ }
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Card className="border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/50 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2 text-lg">
                                                What happens next?
                                            </h3>
                                            <p className="text-emerald-800 dark:text-emerald-200 leading-relaxed">
                                                We'll notify you by email once your membership is approved by the company administrator.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/50 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4 text-left">
                                        <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-amber-900 dark:text-amber-100 mb-2 text-lg">Review Timeline</h3>
                                            <p className="text-amber-800 dark:text-amber-200 leading-relaxed">
                                                Most requests are reviewed within 1–3 business days.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Status Indicator */ }
                        <div className="flex items-center justify-center space-x-4 pt-8">
                            <div className="flex space-x-3">
                                <div className="h-3 w-3 animate-pulse rounded-full bg-primary" />
                                <div className="h-3 w-3 animate-pulse rounded-full bg-primary/70" style={ { animationDelay: "0.2s" } } />
                                <div className="h-3 w-3 animate-pulse rounded-full bg-primary/40" style={ { animationDelay: "0.4s" } } />
                            </div>
                            <span className="text-base font-medium text-muted-foreground">Processing your request</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default JoinCompanyVerificationPending
