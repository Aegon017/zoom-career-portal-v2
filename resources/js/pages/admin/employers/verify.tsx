import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import AppLayout from "@/layouts/app-layout";
import type {
	BreadcrumbItem,
	Company,
	CompanyUser,
	Profile,
	User,
} from "@/types";
import { Head, router } from "@inertiajs/react";
import {
	Briefcase,
	Building2,
	CheckCircle,
	ExternalLink,
	Globe,
	Landmark,
	Mail,
	MapPin,
	Phone,
	Shield,
	User2,
	Users,
} from "lucide-react";
import { useForm } from "react-hook-form";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Employer Verify",
		href: "",
	},
];

interface Props {
	user: User;
	profile: Profile;
	company: Company;
	company_user: CompanyUser;
}

export default function Show({ user, profile, company, company_user }: Props) {
	type FormValues = {
		status: string;
		verification_status: string;
		rejection_reason?: string;
	};

	const form = useForm<FormValues>({
		defaultValues: {
			status: company_user.verification_status ?? "",
			verification_status: company.verification_status ?? "",
			rejection_reason: "",
		},
	});

	const onSubmit = (formData: any) => {
		const data = { ...formData, company_id: company.id, user_id: user.id };
		router.post("/admin/employer/verify", data);
	};

	const { handleSubmit, control, setError, watch } = form;
	const status = watch("status");
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Employer Verify" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="bg-background min-h-screen">
					<div className="container mx-auto max-w-6xl px-4 py-8">
						{/* Header Section */}
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="mb-8">
									<div className="mb-2 flex items-center gap-3">
										<div className="bg-primary/10 rounded-lg p-2">
											<Shield className="text-primary h-6 w-6" />
										</div>
										<div>
											<h1 className="text-foreground text-3xl font-bold">
												Employer Verification
											</h1>
											<p className="text-muted-foreground">
												Review employer and company information
											</p>
										</div>
									</div>
									<div className="mt-4 flex items-center gap-2">
										<CheckCircle className="text-success h-5 w-5" />
										<Badge
											variant="secondary"
											className="bg-success/10 text-success border-success/20 border"
										>
											Pending Verification
										</Badge>
									</div>
								</div>

								<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
									{/* Left Column - Employer Details */}
									<div className="space-y-6 lg:col-span-1">
										{/* Employer Profile Card */}
										<Card className="shadow-lg backdrop-blur-sm">
											<CardHeader className="pb-4">
												<CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
													<User2 className="text-primary h-5 w-5" />
													Employer Profile
												</CardTitle>
											</CardHeader>

											<CardContent className="space-y-6">
												{/* Profile Section */}
												<div className="flex flex-col items-center space-y-4 text-center">
													<Avatar className="ring-primary/10 h-24 w-24 shadow-lg ring-4">
														<AvatarImage src={user.avatar_url || undefined} />
														<AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
															{user.name?.[0]}
														</AvatarFallback>
													</Avatar>
													<div>
														<h3 className="text-foreground text-xl font-semibold">
															{user.name}
														</h3>
														<p className="text-muted-foreground mt-1 flex items-center justify-center gap-1 text-sm">
															<Mail className="h-4 w-4" />
															{user.email}
														</p>
													</div>
												</div>

												<Separator />

												{/* Contact Information */}
												<div className="space-y-3">
													<h4 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
														Contact Details
													</h4>

													{user.phone && (
														<div className="bg-muted flex items-center gap-3 rounded-lg p-3">
															<Phone className="text-muted-foreground h-4 w-4 flex-shrink-0" />
															<span className="text-foreground text-sm">
																{user.phone}
															</span>
														</div>
													)}

													{profile?.job_title && (
														<div className="bg-muted flex items-center gap-3 rounded-lg p-3">
															<Briefcase className="text-muted-foreground h-4 w-4 flex-shrink-0" />
															<span className="text-foreground text-sm">
																{profile?.job_title}
															</span>
														</div>
													)}
												</div>
											</CardContent>

											<Separator />

											{/* Verification Status */}
											<FormField
												control={control}
												name="status"
												render={({ field }) => (
													<FormItem className="p-4">
														<FormLabel>Verification Status</FormLabel>
														<FormControl>
															<Select
																defaultValue={company_user.verification_status}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="Select status" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="pending">
																		Pending
																	</SelectItem>
																	<SelectItem value="verified">
																		Verified
																	</SelectItem>
																	<SelectItem value="rejected">
																		Rejected
																	</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											{status === "rejected" && (
												<FormField
													control={control}
													name="rejection_reason"
													rules={{
														required:
															"Rejection reason is required when rejecting a job",
													}}
													render={({ field }) => (
														<FormItem className="px-4 pb-4">
															<FormLabel>Rejection Reason</FormLabel>
															<FormControl>
																<textarea
																	className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[100px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none"
																	placeholder="Enter the reason for rejection..."
																	{...field}
																/>
															</FormControl>
															<FormMessage />
														</FormItem>
													)}
												/>
											)}
										</Card>
									</div>

									<div className="space-y-6 lg:col-span-2">
										<Card className="shadow-lg backdrop-blur-sm">
											<CardHeader className="pb-4">
												<CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
													<Building2 className="text-primary h-5 w-5" />
													Company Information
												</CardTitle>
											</CardHeader>

											<CardContent>
												{/* Company Header */}
												<div className="mb-8 flex items-start gap-6">
													{company.logo_url && (
														<div className="flex-shrink-0">
															<img
																src={company.logo_url}
																alt="Company Logo"
																className="h-20 w-20 rounded-xl border bg-white object-contain p-2 shadow-sm"
															/>
														</div>
													)}
													<div className="flex-1">
														<h2 className="text-foreground mb-2 text-2xl font-bold">
															{company.name}
														</h2>
														{company.description && (
															<p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
																{company.description}
															</p>
														)}
													</div>
												</div>

												{/* Company Details Grid */}
												<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
													{/* Left Column */}
													<div className="space-y-4">
														<h4 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
															Company Details
														</h4>

														{company.industry && (
															<div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
																<Briefcase className="text-muted-foreground h-4 w-4 flex-shrink-0" />
																<div>
																	<p className="text-muted-foreground text-xs font-medium">
																		Industry
																	</p>
																	<p className="text-foreground text-sm">
																		{company.industry.name}
																	</p>
																</div>
															</div>
														)}

														{company.type && (
															<div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
																<Landmark className="text-muted-foreground h-4 w-4 flex-shrink-0" />
																<div>
																	<p className="text-muted-foreground text-xs font-medium">
																		Company Type
																	</p>
																	<p className="text-foreground text-sm">
																		{company.type}
																	</p>
																</div>
															</div>
														)}

														{company.size && (
															<div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
																<Users className="text-muted-foreground h-4 w-4 flex-shrink-0" />
																<div>
																	<p className="text-muted-foreground text-xs font-medium">
																		Company Size
																	</p>
																	<p className="text-foreground text-sm">
																		{company.size}
																	</p>
																</div>
															</div>
														)}
													</div>

													{/* Right Column */}
													<div className="space-y-4">
														<h4 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
															Contact Information
														</h4>

														{company.website_url && (
															<div className="bg-muted border-muted/30 flex items-center gap-3 rounded-lg border p-3">
																<Globe className="text-muted-foreground h-4 w-4 flex-shrink-0" />
																<div className="min-w-0 flex-1">
																	<p className="text-muted-foreground text-xs font-medium">
																		Website
																	</p>
																	<a
																		href={company.website_url}
																		target="_blank"
																		rel="noopener noreferrer"
																		className="text-primary flex items-center gap-1 truncate text-sm hover:underline"
																	>
																		{company.website_url}
																		<ExternalLink className="h-3 w-3 flex-shrink-0" />
																	</a>
																</div>
															</div>
														)}
														<div className="bg-muted border-muted/30 flex items-start gap-3 rounded-lg border p-3">
															<MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
															<div>
																<p className="text-muted-foreground text-xs font-medium">
																	Email
																</p>
																<p className="text-foreground text-sm leading-relaxed">
																	{company.email}
																</p>
															</div>
														</div>
														<div className="bg-muted border-muted/30 flex items-start gap-3 rounded-lg border p-3">
															<MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
															<div>
																<p className="text-muted-foreground text-xs font-medium">
																	Phone
																</p>
																<p className="text-foreground text-sm leading-relaxed">
																	{company.phone}
																</p>
															</div>
														</div>
														{company.address && (
															<div className="bg-muted border-muted/30 flex items-start gap-3 rounded-lg border p-3">
																<MapPin className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
																<div>
																	<p className="text-muted-foreground text-xs font-medium">
																		Address
																	</p>
																	<p className="text-foreground text-sm leading-relaxed">
																		{company.address.location.city},{" "}
																		{company.address.location.state},{" "}
																		{company.address.location.country}
																	</p>
																</div>
															</div>
														)}
													</div>
												</div>
											</CardContent>

											<Separator />

											{/* Verification Status */}
											<FormField
												control={control}
												name="verification_status"
												render={({ field }) => (
													<FormItem className="p-4">
														<FormLabel>Verification Status</FormLabel>
														<FormControl>
															<Select
																defaultValue={company.verification_status}
																onValueChange={field.onChange}
															>
																<SelectTrigger className="w-full">
																	<SelectValue placeholder="Select status" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value="pending">
																		Pending
																	</SelectItem>
																	<SelectItem value="verified">
																		Verified
																	</SelectItem>
																	<SelectItem value="rejected">
																		Rejected
																	</SelectItem>
																</SelectContent>
															</Select>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</Card>
									</div>
								</div>
								<div className="mt-8 flex justify-end gap-4">
									<Button
										type="button"
										variant="outline"
										onClick={() => router.get("/admin/dashboard")}
									>
										Cancel
									</Button>
									<Button type="submit">Save</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
