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
import { BreadcrumbItem, Opening } from "@/types";
import { Head, router } from "@inertiajs/react";
import { formatDate } from "date-fns";
import { Briefcase, CheckCircle, Shield } from "lucide-react";
import { useForm } from "react-hook-form";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Job Verify",
		href: "",
	},
];

interface Props {
	job: Opening;
}

const Verify = ({ job }: Props) => {
	const form = useForm();

	const { control, handleSubmit, watch } = form;

	const onSubmit = (data: any) => {
		router.post(`/admin/job/verify/${job.id}`, data);
	};

	const verificationStatus = watch("verification_status");

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Employer Verify" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="bg-background min-h-screen">
					<div className="container mx-auto max-w-6xl px-4 py-8">
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="mb-8">
									<div className="mb-2 flex items-center gap-3">
										<div className="bg-primary/10 rounded-lg p-2">
											<Shield className="text-primary h-6 w-6" />
										</div>
										<div>
											<h1 className="text-foreground text-3xl font-bold">
												Job Verification
											</h1>
											<p className="text-muted-foreground">
												Review job information
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
									<div className="space-y-6 lg:col-span-3">
										<Card className="shadow-lg backdrop-blur-sm">
											<CardHeader className="pb-4">
												<CardTitle className="text-foreground flex items-center gap-2 text-lg font-semibold">
													<Briefcase className="text-primary h-5 w-5" />
													Job Details
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-6">
												<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
													<div className="space-y-4">
														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Job Title
															</p>
															<p className="text-foreground text-sm">
																{job.title}
															</p>
														</div>

														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Employment Type
															</p>
															<p className="text-foreground text-sm capitalize">
																{job.employment_type}
															</p>
														</div>

														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Work Model
															</p>
															<p className="text-foreground text-sm capitalize">
																{job.work_model}
															</p>
														</div>

														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Status
															</p>
															<p className="text-foreground text-sm capitalize">
																{job.status}
															</p>
														</div>

														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Verification Status
															</p>
															<p className="text-foreground text-sm capitalize">
																{job.verification_status}
															</p>
														</div>
													</div>

													<div className="space-y-4">
														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Location
															</p>
															<p className="text-foreground text-sm">{`${job.address?.location?.city}, ${job.address?.location?.state}, ${job.address?.location?.country}`}</p>
														</div>

														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Salary
															</p>
															<p className="text-foreground text-sm">
																{job.currency} {job.salary_min} –{" "}
																{job.salary_max} {job.salary_unit}
															</p>
														</div>

														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Published At
															</p>
															<p className="text-foreground text-sm">
																{formatDate(
																	new Date(job.published_at),
																	"dd MMM yyyy",
																)}
															</p>
														</div>

														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																Expires At
															</p>
															<p className="text-foreground text-sm">
																{formatDate(
																	new Date(job.expires_at),
																	"dd MMM yyyy",
																)}
															</p>
														</div>
														<div className="bg-muted border-muted/30 rounded-lg border p-3">
															<p className="text-muted-foreground text-xs font-medium">
																External Apply Link
															</p>
															<p className="text-foreground text-sm">
																<a
																	href={job.apply_link}
																	target="_blank"
																	rel="noopener noreferrer"
																	className="text-blue-600 hover:underline"
																>
																	{job.apply_link}
																</a>
															</p>
														</div>
													</div>
												</div>

												<div className="bg-muted border-muted/30 mt-4 rounded-lg border p-3">
													<p className="text-muted-foreground mb-1 text-xs font-medium">
														Job Description
													</p>
													<div
														className="text-foreground text-sm"
														dangerouslySetInnerHTML={{
															__html: job.description,
														}}
													/>
												</div>
											</CardContent>
											<Separator />

											<FormField
												control={control}
												name="verification_status"
												render={({ field }) => (
													<FormItem className="p-4">
														<FormLabel>Verification Status</FormLabel>
														<FormControl>
															<Select
																defaultValue={job.verification_status}
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
											{verificationStatus === "rejected" && (
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
};

export default Verify;
