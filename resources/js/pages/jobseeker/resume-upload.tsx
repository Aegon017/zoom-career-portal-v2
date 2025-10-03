import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { router, Head } from "@inertiajs/react";
import FileUpload from "@/components/file-upload";
import { AppHeader } from "@/components/app-header";
import { Card, CardTitle, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type ResumeFormInputs = {
	resume: string;
};

const ResumeUpload = () => {
	const form = useForm<ResumeFormInputs>({
		defaultValues: {
			resume: "",
		},
	});

	const handleFileUpload = (field: keyof ResumeFormInputs) => (url: string) => {
		form.setValue(field, url);
	};

	const onSubmit = (values: ResumeFormInputs) => {
		router.post("/jobseeker/resume/upload", values);
	};

	return (
		<>
			<AppHeader />
			<Head title="Upload Resume" />
			<div className="flex flex-1 flex-col gap-6 rounded-xl p-2 sm:p-6 w-full max-w-3xl mx-auto">
				<div className="text-center">
					<h1 className="text-2xl font-bold">Upload Your Resume</h1>
					<p className="mt-2 text-sm text-gray-500">
						Upload your resume in PDF format to complete your profile
					</p>
				</div>

				<Card className="p-4 sm:p-6">
					<CardContent className="p-0 pt-4">
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className="space-y-6"
							>
								<FormField
									control={form.control}
									name="resume"
									render={() => (
										<FormItem>
											<FormLabel>Resume (PDF only)</FormLabel>
											<FormControl>
												<FileUpload
													acceptedFileTypes={["application/pdf"]}
													placeholder="Drag & Drop your resume (PDF only)"
													name="file"
													onUploaded={handleFileUpload("resume")}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit" className="w-full">
									Upload Resume
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default ResumeUpload;
