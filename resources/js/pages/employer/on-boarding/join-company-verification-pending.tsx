import { AppHeader } from "@/components/employer/employer-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Company } from "@/types";
import { Head } from "@inertiajs/react";
import { Building2, CheckCircle, Clock, Mail, Sparkles } from "lucide-react";

const JoinCompanyVerificationPending = ({ company }: { company: Company }) => {
	return (
		<>
			<Head title="Join Company Verification Pending" />
			<AppHeader />
			<div className="from-background via-muted/20 to-muted/40 min-h-screen bg-gradient-to-br">
				<div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
					<div className="w-full max-w-4xl space-y-12 text-center">
						{/* Animated Loader Section */}
						<div className="relative mx-auto h-32 w-32">
							{/* Outer rotating rings */}
							<div
								className="border-muted absolute inset-0 animate-spin rounded-full border-4"
								style={{ animationDuration: "3s" }}
							/>
							<div
								className="border-muted-foreground/30 absolute inset-2 animate-spin rounded-full border-2 border-dashed"
								style={{
									animationDuration: "2s",
									animationDirection: "reverse",
								}}
							/>

							{/* Center icon */}
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="bg-primary flex h-16 w-16 items-center justify-center rounded-full shadow-lg">
									<CheckCircle className="text-primary-foreground h-8 w-8 animate-pulse" />
								</div>
							</div>

							{/* Floating icons */}
							<div
								className="absolute -top-3 -right-3 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-emerald-500 shadow-lg"
								style={{ animationDelay: "0.2s" }}
							>
								<Building2 className="h-4 w-4 text-white" />
							</div>
							<div
								className="absolute -bottom-3 -left-3 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-violet-500 shadow-lg"
								style={{ animationDelay: "0.6s" }}
							>
								<Mail className="h-4 w-4 text-white" />
							</div>
							<div
								className="absolute top-1/2 -left-6 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-amber-500 shadow-lg"
								style={{ animationDelay: "0.4s" }}
							>
								<Clock className="h-4 w-4 text-white" />
							</div>
							<div
								className="absolute top-1/2 -right-6 flex h-8 w-8 animate-bounce items-center justify-center rounded-full bg-pink-500 shadow-lg"
								style={{ animationDelay: "0.8s" }}
							>
								<Sparkles className="h-4 w-4 text-white" />
							</div>
						</div>

						{/* Header Section */}
						<div className="space-y-6">
							<div className="space-y-4">
								<h1 className="text-foreground text-4xl leading-tight font-bold md:text-5xl">
									Request Under Review
								</h1>
								<div className="bg-primary mx-auto h-1.5 w-32 rounded-full" />
							</div>
							<p className="text-muted-foreground mx-auto max-w-2xl text-lg leading-relaxed">
								Your membership request has been submitted successfully and is
								currently being processed.
							</p>
						</div>

						{/* Company Card */}
						<div className="mx-auto max-w-2xl">
							<Card className="border-border/60 bg-card/80 shadow-xl backdrop-blur-sm">
								<CardContent className="p-8 md:p-10">
									<div className="mb-6 flex items-center gap-6">
										<div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
											<Building2 className="text-primary-foreground h-8 w-8" />
										</div>
										<div className="text-left">
											<h2 className="text-card-foreground mb-1 text-2xl font-bold">
												{company.name}
											</h2>
											<Badge
												variant="secondary"
												className="text-xs font-medium tracking-wider uppercase"
											>
												Company
											</Badge>
										</div>
									</div>

									<div className="border-primary/20 bg-primary/5 rounded-2xl border p-5">
										<p className="text-primary text-base leading-relaxed font-semibold">
											Your membership request is currently being reviewed by the
											company administrator.
										</p>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Information Cards */}
						<div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
							<Card className="border-emerald-200 bg-emerald-50 shadow-lg dark:border-emerald-800 dark:bg-emerald-950/50">
								<CardContent className="p-6">
									<div className="flex items-start gap-4 text-left">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500">
											<Mail className="h-5 w-5 text-white" />
										</div>
										<div>
											<h3 className="mb-2 text-lg font-bold text-emerald-900 dark:text-emerald-100">
												What happens next?
											</h3>
											<p className="leading-relaxed text-emerald-800 dark:text-emerald-200">
												We'll notify you by email once your membership is
												approved by the company administrator.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>

							<Card className="border-amber-200 bg-amber-50 shadow-lg dark:border-amber-800 dark:bg-amber-950/50">
								<CardContent className="p-6">
									<div className="flex items-start gap-4 text-left">
										<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-500">
											<Clock className="h-5 w-5 text-white" />
										</div>
										<div>
											<h3 className="mb-2 text-lg font-bold text-amber-900 dark:text-amber-100">
												Review Timeline
											</h3>
											<p className="leading-relaxed text-amber-800 dark:text-amber-200">
												Most requests are reviewed within 1–3 business days.
											</p>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Status Indicator */}
						<div className="flex items-center justify-center space-x-4 pt-8">
							<div className="flex space-x-3">
								<div className="bg-primary h-3 w-3 animate-pulse rounded-full" />
								<div
									className="bg-primary/70 h-3 w-3 animate-pulse rounded-full"
									style={{ animationDelay: "0.2s" }}
								/>
								<div
									className="bg-primary/40 h-3 w-3 animate-pulse rounded-full"
									style={{ animationDelay: "0.4s" }}
								/>
							</div>
							<span className="text-muted-foreground text-base font-medium">
								Processing your request
							</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default JoinCompanyVerificationPending;
