import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Opening } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./job-columns";

const breadcrumbs: BreadcrumbItem[] = [
	{ title: "Jobs Report", href: "/admin/reports/jobs" },
];

interface Props {
	data: {
		data: Opening[];
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

const JobsReport = ({ data, filters }: Props) => {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Jobs Report" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					columns={columns}
					data={data.data}
					routeName="/admin/reports/jobs"
					listingName="student"
					pagination={{
						current_page: data.current_page,
						last_page: data.last_page,
						per_page: data.per_page,
						total: data.total,
					}}
					filters={filters}
				/>
			</div>
		</AppLayout>
	);
};

export default JobsReport;
