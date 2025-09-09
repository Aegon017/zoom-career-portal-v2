import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { JobTitle, type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./job-title-colums";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Job Titles",
		href: "/admin/job-titles",
	},
];

interface Props {
	jobTitles: {
		data: JobTitle[];
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

export default function SkillsListing({ jobTitles, filters }: Props) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Job titles" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					columns={columns}
					data={jobTitles.data}
					pagination={{
						current_page: jobTitles.current_page,
						last_page: jobTitles.last_page,
						per_page: jobTitles.per_page,
						total: jobTitles.total,
					}}
					filters={filters}
					routeName="/admin/job-titles"
					listingName="job title"
					createUrl="/admin/job-titles/create"
					hasImport={true}
					importUrl="/admin/job-titles/import"
					importColumns={["name"]}
				/>
			</div>
		</AppLayout>
	);
}
