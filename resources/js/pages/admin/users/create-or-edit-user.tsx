"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";
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
import {
	type BreadcrumbItem,
	type Option,
	type Role,
	type User,
} from "@/types";
import MultipleSelector from "@/components/multiple-selector";

interface Props {
	user: User;
	roleOptions: Option[];
	operation: Option;
}

type FormData = {
	name: string;
	email: string;
	password?: string;
	roles: Option[];
};

export default function CreateOrEditUser({
	user,
	roleOptions,
	operation,
}: Props) {
	const [alertOpen, setAlertOpen] = useState(false);

	const form = useForm<FormData>({
		defaultValues: {
			name: user?.name || "",
			email: user?.email || "",
			password: "",
			roles:
				user?.roles?.map((role) => ({
					value: String(role.id),
					label: role.name,
				})) || [],
		},
	});

	const { handleSubmit, control, setError } = form;

	const breadcrumbs: BreadcrumbItem[] = useMemo(
		() => [
			{ title: "Users", href: "/admin/users" },
			{ title: operation.value, href: "" },
		],
		[operation.value],
	);

	const handleErrors = useCallback(
		(errors: Record<string, string>) => {
			Object.entries(errors).forEach(([field, message]) => {
				setError(field as keyof FormData, {
					type: "server",
					message: Array.isArray(message) ? message[0] : message,
				});
			});
		},
		[setError],
	);

	const onSubmit = useCallback(
		(formData: FormData) => {
			const payload = {
				...formData,
				// Remove password field if empty in edit mode
				...(operation.value === "Edit" &&
					!formData.password && { password: undefined }),
				roles: formData.roles.map((role) => Number(role.value)),
			};

			if (operation.value === "Create") {
				router.post("/admin/users", payload, { onError: handleErrors });
			} else {
				router.put(`/admin/users/${user?.id}`, payload, {
					onError: handleErrors,
				});
			}
		},
		[operation.value, user?.id, handleErrors],
	);

	const handleDelete = useCallback(() => {
		router.delete(`/admin/users/${user?.id}`);
	}, [user?.id]);

	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title={`${operation.value} User`} />

			<div className="flex flex-1 flex-col gap-4 rounded-xl p-4 h-full">
				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
						<div className="flex justify-between">
							<h1 className="text-2xl font-bold">{operation.value} User</h1>

							{operation.value === "Edit" && (
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
										alertOpen={alertOpen}
										setAlertOpen={setAlertOpen}
										onDelete={handleDelete}
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
											<FormLabel>Full Name</FormLabel>
											<FormControl>
												<Input type="text" autoComplete="name" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input type="email" autoComplete="email" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="password"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Password
												{operation.value === "Edit" &&
													" (Leave blank to keep current)"}
											</FormLabel>
											<FormControl>
												<Input
													type="password"
													placeholder={
														operation.value === "Edit" ? "••••••••" : ""
													}
													{...field}
													value={field.value || ""}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={control}
									name="roles"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Roles</FormLabel>
											<FormControl>
												<MultipleSelector
													defaultOptions={roleOptions}
													value={field.value}
													onChange={field.onChange}
													emptyIndicator={
														<p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
															No roles found
														</p>
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>

						<div className="flex gap-4">
							<Button type="submit">{operation.label}</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => router.get("/admin/users")}
							>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</AppLayout>
	);
}
