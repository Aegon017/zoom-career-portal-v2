import {
	Mail,
	Phone,
	Briefcase,
	CalendarDays,
	MapPin,
	FileText,
	BookOpen,
	ShieldCheck,
	Languages,
	SquareUser,
	Star,
	Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInitials } from "@/hooks/use-initials";
import AppLayout from "@/layouts/employer-layout";
import { Head } from "@inertiajs/react";
import { format } from "date-fns";
import { Resume, User } from "@/types";

export default function Profile({
	user,
	resume,
}: {
	user: User;
	resume: Resume;
}) {
	const getInitials = useInitials();
	return (
		<AppLayout>
			<Head title={`${user.name}'s Profile`} />
			<div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
				{/* Header Section - Responsive */}
				<div className="relative mb-12 sm:mb-16">
					<div className="h-24 sm:h-36 bg-gradient-to-r from-orange-700 to-blue-950 rounded-t-xl" />
					<div className="absolute -bottom-16 sm:-bottom-16 left-4 sm:left-6 flex flex-col sm:flex-row items-center sm:items-end">
						<div className="relative">
							<Avatar className="h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32 border-4 border-white shadow-lg">
								<AvatarImage src={user.avatar_url} alt={user.name} />
								<AvatarFallback className="text-xl sm:text-2xl md:text-3xl">
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
						</div>

						<div className="mt-2 sm:ml-4 sm:mb-2 text-center sm:text-left">
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
								<h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">
									{user.name}
								</h1>
							</div>

							<div className="flex justify-center sm:justify-start items-center gap-2 mt-1">
								<Briefcase className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
								<span className="text-sm sm:text-base md:text-lg text-foreground">
									{user.profile?.job_title}
								</span>
							</div>

							<div className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground">
								<span className="flex justify-center sm:justify-start items-center gap-1">
									<CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
									Profile last updated -{" "}
									{user.profile?.updated_at
										? format(new Date(user.profile.updated_at), "dd MMM yyyy")
										: "N/A"}
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Main Grid - Responsive Columns */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-16 sm:mt-20">
					{/* Left Column (2/3 width on large screens) */}
					<div className="lg:col-span-2 space-y-4 sm:space-y-6">
						{/* Summary Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<Users className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Summary</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-foreground text-sm sm:text-base leading-relaxed">
									{user.profile?.summary || "No summary available"}
								</p>
							</CardContent>
						</Card>

						{/* Resume Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<FileText className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Resume</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted rounded-lg p-3 sm:p-4">
									<div>
										<div className="font-medium text-foreground text-sm sm:text-base">
											{resume?.media[0]?.name || "No resume uploaded"}
										</div>
										{resume?.updated_at && (
											<div className="text-xs sm:text-sm text-muted-foreground mt-1">
												{format(new Date(resume.updated_at), "dd MMM yyyy")}
											</div>
										)}
									</div>
									{resume?.resume_url && (
										<a
											href={resume.resume_url}
											className="mt-2 sm:mt-0 w-full sm:w-auto"
										>
											<Button variant="outline" className="w-full sm:w-auto">
												<FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />{" "}
												View
											</Button>
										</a>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Skills Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<Star className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Skills</span>
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									{(user.skills ?? []).length > 0 ? (
										(user.skills ?? []).map((skill) => (
											<Badge
												key={skill.id}
												variant="secondary"
												className="px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium bg-primary/10 text-primary"
											>
												{skill.name}
											</Badge>
										))
									) : (
										<p className="text-muted-foreground text-sm">
											No skills listed
										</p>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Employment Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<Briefcase className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Employment</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								{user.work_experiences?.length > 0 ? (
									user.work_experiences.map((workExperience, index) => (
										<div key={index}>
											<div className="flex flex-col sm:flex-row sm:justify-between">
												<h4 className="font-semibold text-base sm:text-lg text-foreground">
													{workExperience?.title || "Untitled position"}
												</h4>
												<span className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-0">
													{workExperience?.start_date
														? format(
																new Date(workExperience.start_date),
																"MMM yyyy",
															)
														: "-"}{" "}
													–{" "}
													{workExperience?.is_current
														? "Present"
														: workExperience?.end_date
															? format(
																	new Date(workExperience.end_date),
																	"MMM yyyy",
																)
															: "-"}
												</span>
											</div>
											<div className="text-foreground text-sm sm:text-base mt-1">
												{workExperience?.company_name ||
													workExperience?.company?.name ||
													"Unknown company"}
											</div>
											{index < user.work_experiences.length - 1 && (
												<Separator className="my-3 sm:my-4" />
											)}
										</div>
									))
								) : (
									<p className="text-muted-foreground text-sm">
										No employment history
									</p>
								)}
							</CardContent>
						</Card>

						{/* Education Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Education</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4 sm:space-y-6">
								{user.educations?.length > 0 ? (
									user.educations.map((education, index) => (
										<div key={index}>
											<div className="flex flex-col sm:flex-row sm:justify-between">
												<h4 className="font-semibold text-base sm:text-lg text-foreground">
													{education.course_title || "Untitled course"}
												</h4>
												<span className="text-muted-foreground text-xs sm:text-sm mt-1 sm:mt-0">
													{education.start_date
														? education.is_current
															? `${new Date(education.start_date).getFullYear()} - Present`
															: education.end_date
																? `${new Date(education.start_date).getFullYear()} - ${new Date(education.end_date).getFullYear()}`
																: `${new Date(education.start_date).getFullYear()} - -`
														: "-"}
												</span>
											</div>
											<div className="text-foreground text-sm sm:text-base mt-1">
												{education.institution || "Unknown institution"}
											</div>
											{education.course_type && (
												<div className="mt-2">
													<Badge
														variant="outline"
														className="border-primary text-primary text-xs sm:text-sm"
													>
														{education.course_type}
													</Badge>
												</div>
											)}
											{index < user.educations.length - 1 && (
												<Separator className="my-3 sm:my-4" />
											)}
										</div>
									))
								) : (
									<p className="text-muted-foreground text-sm">
										No education history
									</p>
								)}
							</CardContent>
						</Card>
					</div>

					{/* Right Column (1/3 width on large screens) */}
					<div className="space-y-4 sm:space-y-6">
						{/* Personal Details Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<SquareUser className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Personal Details</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<DetailItem
									label="Gender"
									value={user.personal_detail?.gender || "Not specified"}
								/>

								<DetailItem
									label="Date of Birth"
									value={
										user.personal_detail?.date_of_birth
											? format(
													new Date(user.personal_detail.date_of_birth),
													"dd MMM yyyy",
												)
											: "Not specified"
									}
								/>

								<DetailItem
									label="Address"
									value={user.address?.location?.full_name || "Not specified"}
								/>

								<DetailItem
									label="Marital Status"
									value={
										user.personal_detail?.marital_status || "Not specified"
									}
								/>

								<DetailItem
									label="Work Permit"
									value={
										user.work_permits?.length > 0
											? user.work_permits.map((wp) => wp.country).join(", ")
											: "None"
									}
								/>

								<DetailItem
									label="Differently Abled"
									value={user.personal_detail?.differently_abled ? "Yes" : "No"}
								/>
							</CardContent>
						</Card>

						{/* Contact Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<Users className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Contact</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								<ContactItem
									icon={<Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />}
									label="Email"
									value={user.email}
								/>

								<ContactItem
									icon={
										<Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
									}
									label="Phone"
									value={user.phone || "Not specified"}
								/>

								<ContactItem
									icon={
										<MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
									}
									label="Location"
									value={user.address?.location?.full_name || "Not specified"}
								/>

								<ContactItem
									icon={
										<Briefcase className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
									}
									label="Experience"
									value={user.profile?.experience || "Not specified"}
								/>

								<ContactItem
									icon={
										<CalendarDays className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
									}
									label="Notice Period"
									value={user.profile?.notice_period || "Not specified"}
								/>
							</CardContent>
						</Card>

						{/* Languages Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<Languages className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Languages</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								{(user?.user_languages ?? []).length > 0 ? (
									user.user_languages!.map((userLanguage) => (
										<div key={userLanguage.id}>
											<div className="font-medium text-foreground text-sm sm:text-base">
												{userLanguage?.language?.name || "Unknown language"}
											</div>

											<div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-muted-foreground">
												<span>
													{userLanguage?.proficiency || "Not specified"}
												</span>

												{(userLanguage.can_read ||
													userLanguage.can_write ||
													userLanguage.can_speak) && (
													<div className="flex items-center gap-1">
														{userLanguage.can_read && <span>Read</span>}

														{userLanguage.can_write && (
															<>
																{userLanguage.can_read && (
																	<Separator
																		orientation="vertical"
																		className="h-3 bg-muted-foreground mx-1"
																	/>
																)}
																<span>Write</span>
															</>
														)}

														{userLanguage.can_speak && (
															<>
																{(userLanguage.can_read ||
																	userLanguage.can_write) && (
																	<Separator
																		orientation="vertical"
																		className="h-3 bg-muted-foreground mx-1"
																	/>
																)}
																<span>Speak</span>
															</>
														)}
													</div>
												)}
											</div>
										</div>
									))
								) : (
									<p className="text-muted-foreground text-sm">
										No languages listed
									</p>
								)}
							</CardContent>
						</Card>

						{/* Certifications Card */}
						<Card>
							<CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-3">
								<CardTitle className="flex items-center gap-1.5 sm:gap-2 text-primary text-base sm:text-lg">
									<ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
									<span>Certifications</span>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3 sm:space-y-4">
								{user.certificates?.length > 0 ? (
									user.certificates.map((certificate) => (
										<div
											key={certificate.id}
											className="font-medium text-foreground text-sm sm:text-base"
										>
											{certificate?.name || "Unnamed certificate"}
										</div>
									))
								) : (
									<p className="text-muted-foreground text-sm">
										No certifications
									</p>
								)}
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}

// Helper components for better organization
const DetailItem = ({ label, value }: { label: string; value: string }) => (
	<div>
		<h4 className="text-xs sm:text-sm text-muted-foreground">{label}</h4>
		<p className="font-medium text-foreground text-sm sm:text-base">{value}</p>
	</div>
);

const ContactItem = ({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: string;
}) => (
	<div className="flex items-start gap-3">
		<div className="bg-muted p-1.5 sm:p-2 rounded-lg flex-shrink-0">{icon}</div>
		<div className="min-w-0 flex-1">
			<h4 className="text-xs sm:text-sm text-muted-foreground">{label}</h4>
			<p className="font-medium text-foreground text-sm sm:text-base break-words whitespace-normal">
				{value}
			</p>
		</div>
	</div>
);
