import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { Domain, JobTitle, type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./domain-columns";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Domains",
		href: "/admin/domains",
	},
];

interface Props {
	data: {
		data: Domain[];
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

export default function DomainsListing({ data, filters }: Props) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Job titles" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					columns={columns}
					data={data.data}
					pagination={{
						current_page: data.current_page,
						last_page: data.last_page,
						per_page: data.per_page,
						total: data.total,
					}}
					filters={filters}
					routeName="/admin/domains"
					listingName="domain"
					createUrl="/admin/domains/create"
					hasImport={true}
				/>
			</div>
		</AppLayout>
	);
}
