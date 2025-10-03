import { AppHeader } from "@/components/employer/employer-header";
import FileUpload from "@/components/file-upload";
import { PhoneInput } from "@/components/phone-input";
import { SelectPopoverField } from "@/components/select-popover-field";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { JobTitle, User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";

interface Props {
	user: User;
	job_titles: JobTitle[];
}

interface FormValues {
	avatar: string;
	job_title: string;
	phone: string;
}

interface Errors {
	[key: string]: string[] | string;
}

const ProfileSetup = ({ user, job_titles }: Props) => {
	const form = useForm<FormValues>({
		defaultValues: {
			avatar: "",
			job_title: "",
			phone: "",
		},
	});

	const { handleSubmit, control, setValue, setError } = form;

	const handleErrors = (errors: Errors) => {
		Object.entries(errors).forEach(([field, messages]) => {
			const message = Array.isArray(messages) ? messages.join(" ") : messages;
			setError(field as keyof FormValues, {
				type: "server",
				message,
			});
		});
	};

	const onSubmit = (data: FormValues) => {
		router.post(
			"/employer/on-boarding/setup/profile",
			{ ...data },
			{
				onError: handleErrors,
				preserveScroll: true,
			},
		);
	};

	return (
		<>
			<Head title="Setup profile" />
			<AppHeader />

			<div className="flex flex-1 justify-center p-8">
				<div className="w-full max-w-xl">
					<h1 className="text-center text-3xl font-bold">
						Complete your profile, {user.name}
					</h1>
					<p className="mt-2 text-center text-sm text-gray-500">
						Maximize your hiring potential—complete your profile to connect with
						twice as many qualified professionals.
					</p>

					<div className="py-8">
						<Form {...form}>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<FormField
									control={control}
									name="avatar"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Profile image (Optional)</FormLabel>
											<FormControl>
												<FileUpload
													acceptedFileTypes={["image/*"]}
													placeholder="Drag & drop your image or click"
													name="file"
													onUploaded={(tempPath) =>
														setValue("avatar", tempPath)
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<SelectPopoverField
									options={job_titles.map((title) => ({
										value: title.name,
										label: title.name,
									}))}
									name="job_title"
									control={control}
									label="Job title"
									placeholder="Select job title"
								/>

								<FormField
									control={control}
									name="phone"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Phone number</FormLabel>
											<FormControl>
												<PhoneInput
													type="tel"
													placeholder="Enter your phone number"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="flex justify-end pt-4">
									<Button type="submit">Continue</Button>
								</div>
							</form>
						</Form>
					</div>
				</div>
			</div>
		</>
	);
};

export default ProfileSetup;
