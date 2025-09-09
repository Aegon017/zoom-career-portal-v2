import DeleteAlert from "@/components/delete-alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { Skill, type BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

const CreateOrEditskill = ({
	skill,
	operation,
	operationLabel,
}: {
	skill: Skill;
	operation: string;
	operationLabel: string;
}) => {
	const breadcrumbs: BreadcrumbItem[] = [
		{
			title: "Skills",
			href: "/admin/skills",
		},
		{
			title: operation,
			href: "",
		},
	];

	const form = useForm<Skill>({
		defaultValues: {
			name: skill?.name ?? "",
		},
	});

	const { handleSubmit, control, setError } = form;

	const onSubmit = (data: any) => {
		const handleErrors = (errors: any) => {
			if (errors && typeof errors === "object") {
				Object.entries(errors).forEach(([field, message]) => {
					setError(field as keyof Skill, {
						type: "server",
						message: message as string,
					});
				});
			}
		};

		const routes = {
			Create: () =>
				router.post("/admin/skills", data, { onError: handleErrors }),
			Edit: () =>
				router.put(`/admin/skills/${skill.id}`, data, {
					onError: handleErrors,
				}),
		};

		routes[operation as keyof typeof routes]?.();
	};

	const handleDelete = (id: number) => {
		router.delete(`/admin/skills/${id}`);
	};

	const [alertOpen, setAlertOpen] = useState<boolean>(false);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`${operation} skill`} />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
						<div className="flex justify-between">
							<h1 className="text-2xl font-bold">{operation} skill</h1>
							{operation === "Edit" && (
								<>
									<Button
										variant="destructive"
										onClick={(e) => {
											e.preventDefault();
											setAlertOpen(true);
										}}
									>
										Delete
									</Button>
									<DeleteAlert
										key={skill.id}
										alertOpen={alertOpen}
										setAlertOpen={setAlertOpen}
										onDelete={() => handleDelete(skill.id)}
									/>
								</>
							)}
						</div>
						<div className="space-y-6">
							<div className="grid gap-4 md:grid-cols-2">
								<FormField
									control={control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Skill name</FormLabel>
											<FormControl>
												<Input type="text" {...field} autoComplete="name" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex gap-4">
							<Button type="submit">{operationLabel}</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.get("/admin/skills")}
							>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</AppLayout>
	);
};

export default CreateOrEditskill;
