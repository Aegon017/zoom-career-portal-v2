import { router } from "@inertiajs/react";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

// Components
import { SelectPopoverField } from "./select-popover-field";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Form } from "./ui/form";
import { Download, Loader2, X } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import TextEditor from "./text-editor";
import { Input } from "./ui/input";

// Types
import { Option } from "@/types";

interface JobOption extends Option {
	value: string;
	label: string;
}

interface FilterFormValues {
	status: string;
	job_id: string;
	skill: string;
}

interface JobApplicationsFilterProps {
	jobOptions: JobOption[];
	skills: string[];
	statuses: Option[];
	defaultValue?: number;
	selectedSkill?: string;
}

const DownloadResumesButton = ({
	jobId,
	skill,
	status,
}: {
	jobId: string;
	skill: string;
	status: string;
}) => {
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = useCallback(async () => {
		if (!jobId) return;

		setIsDownloading(true);
		try {
			const response = await axios.get(
				"/employer/applications/download-resumes",
				{
					params: {
						job_id: jobId,
						skill: skill || undefined,
						status: status || undefined,
					},
					responseType: "blob",
				},
			);

			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "resumes.zip");
			document.body.appendChild(link);
			link.click();
			link.remove();
		} catch (error) {
			console.error("Download failed:", error);
		} finally {
			setIsDownloading(false);
		}
	}, [jobId, skill, status]);

	return (
		<Button
			variant="secondary"
			onClick={handleDownload}
			disabled={isDownloading}
		>
			{isDownloading ? (
				<Loader2 className="mr-2 h-4 w-4 animate-spin" />
			) : (
				<Download className="mr-2 h-4 w-4" />
			)}
			Download Resumes
		</Button>
	);
};

const MessageDialog = ({
	jobId,
	open,
	onOpenChange,
	onSubmit,
}: {
	jobId: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSubmit: (data: { subject: string; message: string }) => void;
}) => {
	const [subject, setSubject] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit({ subject, message });
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Message Shortlisted Candidates</DialogTitle>
					<DialogDescription>
						Send a message to all shortlisted candidates for this job.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="space-y-4">
					<Input
						value={subject}
						onChange={(e) => setSubject(e.target.value)}
						placeholder="Subject"
						required
					/>
					<TextEditor
						value={message}
						onChange={setMessage}
						placeholder="Type your message..."
						disabled={false}
					/>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Cancel</Button>
						</DialogClose>
						<Button type="submit" disabled={!subject.trim() || !message.trim()}>
							Send
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export const JobApplicationsFilter = ({
	jobOptions,
	defaultValue,
	skills,
	statuses,
	selectedSkill,
}: JobApplicationsFilterProps) => {
	const [isMessageOpen, setIsMessageOpen] = useState(false);
	const hasMounted = useRef(false);

	const form = useForm<FilterFormValues>({
		defaultValues: {
			status: "",
			job_id: defaultValue?.toString() ?? "",
			skill: selectedSkill ?? "",
		},
	});

	const { control, watch, reset } = form;
	const [jobId, skill, status] = watch(["job_id", "skill", "status"]);
	const hasFilters = jobId || skill || status;

	// Memoized options
	const skillOptions = useMemo(
		() => [
			{ value: "", label: "All Skills" },
			...skills.map((s) => ({ value: s, label: s })),
		],
		[skills],
	);

	const statusOptions = useMemo(
		() => [
			{ value: "", label: "All Statuses" },
			...statuses.map((s) => ({ value: s.value, label: s.label })),
		],
		[statuses],
	);

	// Filter submission handler
	const submitFilters = useCallback((data: FilterFormValues) => {
		router.get(
			"/employer/applications",
			{
				job_id: data.job_id || undefined,
				skill: data.skill || undefined,
				status: data.status || undefined,
			},
			{
				preserveScroll: true,
				preserveState: true,
				replace: true,
				only: ["applications", "skills", "status"],
			},
		);
	}, []);

	// Message submission handler
	const handleMessageSubmit = useCallback(
		({ subject, message }: { subject: string; message: string }) => {
			router.post(
				`/employer/jobs/${jobId}/shortlisted/message`,
				{ message, subject },
				{
					onSuccess: () => setIsMessageOpen(false),
					onError: () => alert("Failed to send message"),
				},
			);
		},
		[jobId],
	);

	// Debounced filter effect
	useEffect(() => {
		if (hasMounted.current) {
			const timeoutId = setTimeout(() => {
				submitFilters({ job_id: jobId, skill, status });
			}, 300);
			return () => clearTimeout(timeoutId);
		}
		hasMounted.current = true;
	}, [jobId, skill, status, submitFilters]);

	// Clear filters
	const clearFilters = useCallback(
		() => reset({ job_id: "", skill: "", status: "" }),
		[reset],
	);

	return (
		<Card className="border-0 border-b-2 shadow-none rounded-none p-0">
			<CardContent className="p-0 pb-4">
				<Form {...form}>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
							<div className="sm:w-1/3">
								<SelectPopoverField
									control={control}
									name="job_id"
									options={jobOptions}
									placeholder="Select job"
									label="Job"
								/>
							</div>

							{jobId && (
								<>
									<div className="sm:w-1/3">
										<SelectPopoverField
											control={control}
											name="skill"
											options={skillOptions}
											placeholder="Select skill"
											label="Skill"
										/>
									</div>

									<div className="sm:w-1/3">
										<SelectPopoverField
											control={control}
											name="status"
											options={statusOptions}
											placeholder="Select status"
											label="Status"
										/>
									</div>

									<Dialog open={isMessageOpen} onOpenChange={setIsMessageOpen}>
										<DialogTrigger asChild>
											<Button variant="secondary">Message Shortlisted</Button>
										</DialogTrigger>
										<MessageDialog
											jobId={jobId}
											open={isMessageOpen}
											onOpenChange={setIsMessageOpen}
											onSubmit={handleMessageSubmit}
										/>
									</Dialog>

									<DownloadResumesButton
										jobId={jobId}
										skill={skill}
										status={status}
									/>
								</>
							)}

							{hasFilters && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									onClick={clearFilters}
									className="text-muted-foreground hover:text-foreground mt-1 sm:mt-0"
								>
									<X className="mr-1 h-4 w-4" />
									Clear
								</Button>
							)}
						</div>
					</div>
				</Form>
			</CardContent>
		</Card>
	);
};
