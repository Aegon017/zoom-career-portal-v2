import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types";
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
} from "lucide-react";
import { useState } from "react";
import { Link } from "@inertiajs/react";
import MessageButton from "../message-button";

interface Props {
	user: User & {
		match_score?: number | null;
		match_reason?: string | null;
		shortlist_reason?: string | null;
		is_shortlisted?: boolean | null;
	};
}

const JobseekerCard = ({ user }: Props) => {
	const [expanded, setExpanded] = useState(false);
	const toggleExpand = () => setExpanded(!expanded);

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

			<CardHeader className="relative pb-4">
				<div className="flex flex-col sm:flex-row items-start justify-between gap-4">
					<div className="flex min-w-0 flex-1 items-start gap-4">
						<div className="relative">
							<Avatar className="border-muted ring-primary/10 group-hover:ring-primary/20 h-12 w-12 border ring-1 transition-transform duration-300 group-hover:scale-105">
								<AvatarImage
									src={user.avatar_url}
									alt={user.name}
									className="object-cover"
								/>
								<AvatarFallback className="from-primary to-primary/80 text-primary-foreground bg-gradient-to-br text-sm font-semibold">
									{getInitials(user.name)}
								</AvatarFallback>
							</Avatar>
						</div>

						<div className="min-w-0 flex-1 space-y-1.5">
							<Link href={`/employer/jobseekers/${user.id}`}>
								<h3 className="text-foreground group-hover:text-primary truncate text-base font-semibold transition-colors duration-200">
									{user.name}
								</h3>
							</Link>
							{user.phone && (
								<span className="text-muted-foreground flex items-center gap-1 text-xs">
									<Phone className="h-4 w-4" />
									<a href={`tel:${user.phone}`} className="hover:underline">
										{user.phone}
									</a>
								</span>
							)}
							<span className="text-muted-foreground flex items-center gap-1 text-xs">
								<Mail className="h-4 w-4" />
								<a
									href={`mailto:${user.email}`}
									className="hover:underline truncate"
								>
									{user.email}
								</a>
							</span>
							{user.created_at && (
								<div className="text-muted-foreground flex items-center gap-1 text-xs">
									<CalendarDays className="h-4 w-4" />
									<span>Joined {formatDate(user.created_at)}</span>
								</div>
							)}
						</div>
					</div>

					<div className="flex flex-shrink-0 items-center gap-2 self-start sm:self-auto ml-14 sm:ml-0 mt-2 sm:mt-0">
						<MessageButton userId={user.id}>
							<Button
								size="sm"
								variant="outline"
								className="hover:bg-primary hover:text-primary-foreground hover:border-primary px-2 py-1 text-xs transition-colors ease-in-out"
							>
								<Mail className="h-4 w-4" />
								<span className="hidden xs:inline">Message</span>
							</Button>
						</MessageButton>
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleExpand}
							className="text-muted-foreground hover:text-foreground hover:bg-muted h-8 w-8 rounded-md p-0"
							aria-label={expanded ? "Collapse details" : "Expand details"}
						>
							{expanded ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>
				<Separator className="mt-4 sm:mt-6" />

				<div className="mt-4 grid grid-cols-1 gap-4">
					<div className="space-y-2">
						<div className="text-foreground flex items-center gap-2 text-sm font-medium">
							<div className="bg-primary/10 rounded-md p-1.5">
								<FileText className="text-primary h-4 w-4" />
							</div>
							<span>Resume</span>
						</div>
						<div className="pl-7">
							{(() => {
								const latestResume = user?.resumes?.sort(
									(a, b) =>
										new Date(b.created_at).getTime() -
										new Date(a.created_at).getTime(),
								)[0];

								const resumeUrl = latestResume?.resume_url ?? undefined;

								return resumeUrl ? (
									<Button
										variant="ghost"
										size="sm"
										asChild
										className="rounded-md border border-transparent px-3 py-1.5 text-sm font-medium text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-900 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400"
									>
										<a
											href={resumeUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<FileText className="h-4 w-4" />
											<span className="ml-1">View</span>
											<ExternalLink className="h-3 w-3 ml-1" />
										</a>
									</Button>
								) : (
									<span className="text-muted-foreground text-sm">
										No resume available
									</span>
								);
							})()}
						</div>
					</div>

					{user.match_score !== null && user.match_score !== undefined && (
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<div className="text-foreground flex items-center gap-2 text-sm font-medium">
									<div className="bg-primary/10 rounded-md p-1.5">
										<TrendingUp className="text-primary h-4 w-4" />
									</div>
									<span>Match Score</span>
								</div>
								<div className="text-right">
									<div className="text-foreground text-xl font-semibold">
										{user.match_score}
									</div>
									<div className="text-muted-foreground text-xs">
										out of 100
									</div>
								</div>
							</div>
							<div className="space-y-2 pl-7">
								<Progress
									value={user.match_score}
									className="bg-muted h-2 rounded-full"
								/>
								<Badge
									variant="outline"
									className={`rounded-full px-2 py-1 text-xs ${getMatchColor(user.match_score)}`}
								>
									<Sparkles className="mr-1.5 h-3 w-3" />
									{getMatchLabel(user.match_score)} match
								</Badge>
							</div>
						</div>
					)}
				</div>
			</CardHeader>

			{expanded && (
				<>
					<Separator />
					<CardContent className="bg-muted/10 space-y-5 rounded-b-xl p-4 sm:p-5">
						{user.match_reason && (
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<div className="bg-primary rounded-md p-2 shadow">
										<Sparkles className="h-4 w-4 text-white" />
									</div>
									<h4 className="text-foreground text-sm font-semibold">
										Match Analysis
									</h4>
								</div>
								<Card className="bg-card/50 border-0 shadow-sm backdrop-blur-sm">
									<CardContent className="text-muted-foreground p-4 text-sm leading-relaxed">
										{user.match_reason}
									</CardContent>
								</Card>
							</div>
						)}

						{user.shortlist_reason && user.is_shortlisted && (
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<div className="bg-emerald-500 rounded-md p-2 shadow">
										<Sparkles className="h-4 w-4 text-white" />
									</div>
									<h4 className="text-foreground text-sm font-semibold">
										Recommendation
									</h4>
								</div>
								<Card className="bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 border">
									<CardContent className="text-emerald-700 dark:text-emerald-400 p-4 text-sm leading-relaxed">
										{user.shortlist_reason}
									</CardContent>
								</Card>
							</div>
						)}
					</CardContent>
				</>
			)}
		</Card>
	);
};

export default JobseekerCard;
