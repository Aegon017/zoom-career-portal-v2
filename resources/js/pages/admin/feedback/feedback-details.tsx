import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BreadcrumbItem, Feedback } from "@/types";
import { Head } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";

interface FeedbackProps {
	feedback: Feedback;
}

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Feedback",
		href: "/admin/feedback",
	},
	{
		title: "Details",
		href: "",
	},
];

const FeedbackDetails = ({ feedback }: FeedbackProps) => {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Feedback Details" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<Card>
					<CardHeader>
						<CardTitle className="text-2xl font-semibold text-gray-800">
							Feedback for:{" "}
							<span className="text-primary">{feedback.opening.title}</span>
						</CardTitle>
						<p className="text-sm text-muted-foreground mt-1">
							Submitted by{" "}
							<span className="font-medium">{feedback.user.name}</span> (
							{feedback.user.email}) on{" "}
							<span>{new Date(feedback.created_at).toLocaleString()}</span>
						</p>
					</CardHeader>

					<Separator className="my-2" />

					<CardContent className="space-y-6 py-4">
						<div className="space-y-1">
							<h3 className="text-base font-semibold text-gray-700">
								1. Overall Experience
							</h3>
							<p className="text-sm text-gray-900">{feedback.feedback}</p>
						</div>

						<div className="space-y-1">
							<h3 className="text-base font-semibold text-gray-700">
								2. Suitable Candidates
							</h3>
							<p className="text-sm text-gray-900">{feedback.hired_details}</p>
						</div>

						<div className="space-y-1">
							<h3 className="text-base font-semibold text-gray-700">
								3. Hired Candidates
							</h3>
							{feedback.selected_candidates.length > 0 ? (
								<div className="flex flex-wrap gap-2">
									{feedback.selected_candidates.map((c) => (
										<Badge key={c.value} variant="secondary">
											{c.label}
										</Badge>
									))}
								</div>
							) : (
								<p className="text-sm text-muted-foreground">None selected</p>
							)}
						</div>

						<div className="space-y-1">
							<h3 className="text-base font-semibold text-gray-700">
								4. Additional Comments
							</h3>
							<p className="text-sm text-gray-900">
								{feedback.additional_comments}
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</AppLayout>
	);
};

export default FeedbackDetails;
