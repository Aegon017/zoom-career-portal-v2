import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { Course, type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./course-columns";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Courses",
		href: "/admin/courses",
	},
];

interface Props {
	data: {
		data?: Course[];
		current_page: number;
		last_page: number;
		per_page: number;
		total: number;
	};
	filters: {
		search?: string;
		perPage?: number;
	};
}

export default function CompaniesListing({ data, filters }: Props) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Courses" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					hasCreate={true}
					columns={columns}
					data={data?.data ?? []}
					pagination={{
						current_page: data?.current_page,
						last_page: data?.last_page,
						per_page: data?.per_page,
						total: data?.total,
					}}
					filters={filters}
					routeName="/admin/courses"
					listingName="course"
					createUrl="/admin/courses/create"
					hasImport={true}
					importUrl="/admin/courses/import"
					importColumns={["name"]}
				/>
			</div>
		</AppLayout>
	);
}
