import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { User, type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./recruiter-columns";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Recruiters",
		href: "/admin/recruiters",
	},
];

interface Props {
	recruiters: {
		data: User[];
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

export default function RecruitersListing({ recruiters, filters }: Props) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Recruiters" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					hasCreate={true}
					columns={columns}
					data={recruiters.data}
					pagination={{
						current_page: recruiters.current_page,
						last_page: recruiters.last_page,
						per_page: recruiters.per_page,
						total: recruiters.total,
					}}
					filters={filters}
					routeName="/admin/recruiters"
					listingName="recruiter"
					createUrl="/admin/recruiters/create"
				/>
			</div>
		</AppLayout>
	);
}
