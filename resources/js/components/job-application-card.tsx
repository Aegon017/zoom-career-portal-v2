import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { Application, Option } from "@/types";
import {
	CalendarDays,
	ChevronDown,
	ChevronUp,
	ExternalLink,
	FileText,
	Mail,
	Phone,
	Sparkles,
	TrendingUp,
	User,
} from "lucide-react";
import { useState, memo, useCallback } from "react";
import JobStatus from "./job-status";
import MessageButton from "./message-button";
import { Link } from "@inertiajs/react";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
	application: Application;
	statuses: Option[];
	message?: boolean;
	selectable?: boolean;
	selected?: boolean;
	onSelect?: (id: number, selected: boolean) => void;
}

const JobApplicationCard = memo(
	({
		application,
		statuses,
		message = true,
		selectable = false,
		selected = false,
		onSelect,
	}: Props) => {
		const [expanded, setExpanded] = useState(false);
		const toggleExpand = () => setExpanded(!expanded);

		const handleSelect = useCallback(
			(checked: boolean) => {
				onSelect?.(application.id, checked);
			},
			[onSelect, application.id],
		);

		const getMatchColor = (score: number | null | undefined) => {
			if (!score) return "bg-muted/50 text-muted-foreground border-muted";
			if (score >= 80)
				return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800";
			if (score >= 60)
				return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800";
			if (score >= 40)
				return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800";
			return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800";
		};

		const getMatchLabel = (score: number | null | undefined) => {
			if (!score) return "Not scored";
			if (score >= 80) return "Excellent";
			if (score >= 60) return "Good";
			if (score >= 40) return "Fair";
			return "Low";
		};

		const getProgressColor = (score: number | null | undefined) => {
			if (!score) return "";
			if (score >= 80) return "bg-emerald-500";
			if (score >= 60) return "bg-blue-500";
			if (score >= 40) return "bg-amber-500";
			return "bg-red-500";
		};

		const formatDate = (dateString: string) => {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				month: "short",
				day: "numeric",
				year: "numeric",
			});
		};

		const getInitials = (name: string) => {
			return name
				.split(" ")
				.map((n) => n[0])
				.join("")
				.toUpperCase()
				.slice(0, 2);
		};

		return (
			<Card className="group border-border/60 hover:border-primary/30 bg-background/95 relative overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-md">
				<div className="from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
				{selectable && (
					<div className="absolute top-3 left-3 z-10">
						<Checkbox
							checked={selected}
							onCheckedChange={handleSelect}
							className="h-5 w-5 rounded-md border-2 data-[state=checked]:bg-primary"
						/>
					</div>
				)}
				<CardHeader className="relative pb-3 sm:pb-4">
					{/* Main Content - Responsive Flex */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
						{/* User Info Section */}
						<div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
							<div className="relative">
								<Avatar className="border-muted ring-primary/10 group-hover:ring-primary/20 h-10 w-10 sm:h-12 sm:w-12 border ring-1 transition-transform duration-300 group-hover:scale-105">
									<AvatarImage
										src={application.user.avatar_url}
										alt={application.user.name}
										className="object-cover"
									/>
									<AvatarFallback className="from-primary to-primary/80 text-primary-foreground bg-gradient-to-br text-sm font-semibold">
										{getInitials(application.user.name)}
									</AvatarFallback>
								</Avatar>
							</div>

							<div className="min-w-0 flex-1 space-y-1 sm:space-y-1.5">
								<Link href={`/employer/jobseekers/${application.user.id}`}>
									<h3 className="text-foreground group-hover:text-primary truncate text-base font-semibold transition-colors duration-200">
										{application.user.name}
									</h3>
								</Link>

								{/* Contact Info - Stack on mobile, inline on sm+ */}
								<div className="grid grid-cols-1 gap-1 sm:flex sm:flex-col">
									<div className="flex flex-wrap gap-x-2 gap-y-1">
										<span className="text-muted-foreground flex items-center gap-1 text-xs">
											<Phone className="h-3 w-3 sm:h-4 sm:w-4" />
											{application.user.phone}
										</span>
										<span className="text-muted-foreground flex items-center gap-1 text-xs">
											<Mail className="h-3 w-3 sm:h-4 sm:w-4" />
											{application.user.email}
										</span>
									</div>
									<div className="text-muted-foreground flex items-center gap-1 text-xs">
										<CalendarDays className="h-3 w-3 sm:h-4 sm:w-4" />
										<span>Applied {formatDate(application.created_at)}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Action Buttons */}
						<div className="flex flex-shrink-0 items-center justify-end gap-2 pt-1 sm:pt-0">
							{message && (
								<MessageButton userId={application.user.id}>
									<Button
										size="sm"
										variant="outline"
										className="hover:bg-primary hover:text-primary-foreground hover:border-primary px-2 py-1 text-xs transition-colors ease-in-out"
									>
										<Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
										<span className="sr-only sm:not-sr-only sm:ml-1">
											Message
										</span>
									</Button>
								</MessageButton>
							)}
							<Button
								variant="ghost"
								size="icon"
								onClick={toggleExpand}
								className="text-muted-foreground hover:text-foreground hover:bg-muted h-7 w-7 sm:h-8 sm:w-8 rounded-md p-0"
								aria-label={expanded ? "Collapse details" : "Expand details"}
							>
								{expanded ? (
									<ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								) : (
									<ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
								)}
							</Button>
						</div>
					</div>

					<Separator className="mt-3 sm:mt-4" />

					{/* Status & Match Score Section - Responsive Grid */}
					<div className="mt-3 sm:mt-4 grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
						{/* Status Column */}
						<div className="space-y-2">
							<div className="text-foreground flex items-center gap-2 text-sm font-medium">
								<div className="bg-primary/10 rounded-md p-1.5">
									<User className="text-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
								</div>
								<span>Status</span>
							</div>
							<div className="pl-6 sm:pl-7">
								<JobStatus statuses={statuses} application={application} />
							</div>
							{application.resume?.resume_url && (
								<div className="flex justify-end">
									<Button
										variant="ghost"
										size="sm"
										asChild
										className="rounded-md border border-transparent px-2.5 py-1.5 text-xs sm:text-sm font-medium text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
									>
										<a
											href={application.resume?.resume_url}
											target="_blank"
											rel="noopener noreferrer"
										>
											<FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
											<span>View Resume</span>
											<ExternalLink className="h-3 w-3 ml-1.5" />
										</a>
									</Button>
								</div>
							)}
						</div>

						{/* Match Score Column - Hidden if null */}
						{application.match_score !== null && (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<div className="text-foreground flex items-center gap-2 text-sm font-medium">
										<div className="bg-primary/10 rounded-md p-1.5">
											<TrendingUp className="text-primary h-3.5 w-3.5 sm:h-4 sm:w-4" />
										</div>
										<span>Match Score</span>
									</div>
									<div className="text-right">
										<div className="text-foreground text-lg sm:text-xl font-semibold">
											{application.match_score}
										</div>
										<div className="text-muted-foreground text-xs">
											out of 100
										</div>
									</div>
								</div>
								<div className="space-y-2 pl-6 sm:pl-7">
									<div
										className={`${getProgressColor(application.match_score)} rounded-full h-2`}
									>
										<Progress
											value={application.match_score}
											className="h-full bg-current"
										/>
									</div>
									<Badge
										variant="outline"
										className={`rounded-full px-2 py-1 text-xs ${getMatchColor(application.match_score)}`}
									>
										<Sparkles className="mr-1.5 h-3 w-3" />
										{getMatchLabel(application.match_score)} match
									</Badge>
								</div>
							</div>
						)}
					</div>
				</CardHeader>

				{/* Expandable Content */}
				{expanded && (
					<>
						<Separator />
						<CardContent className="bg-muted/10 space-y-4 rounded-b-xl p-3 sm:p-4 sm:space-y-5">
							{application.match_summary && (
								<div className="space-y-3">
									<div className="flex items-center gap-2">
										<div className="bg-primary rounded-md p-1.5 sm:p-2 shadow">
											<Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
										</div>
										<h4 className="text-foreground text-sm font-semibold">
											Match Analysis
										</h4>
									</div>
									<Card className="bg-card/50 border-0 shadow-sm backdrop-blur-sm">
										<CardContent className="text-muted-foreground p-3 sm:p-4 text-sm leading-relaxed">
											{application.match_summary}
										</CardContent>
									</Card>
								</div>
							)}
						</CardContent>
					</>
				)}
			</Card>
		);
	},
);

JobApplicationCard.displayName = "JobApplicationCard";

export default JobApplicationCard;
