import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { Industry, type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./industry-columns";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Industries",
		href: "/admin/industries",
	},
];

interface Props {
	industries: {
		data: Industry[];
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

export default function IndustriesListing({ industries, filters }: Props) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Industries" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					columns={columns}
					data={industries.data}
					pagination={{
						current_page: industries.current_page,
						last_page: industries.last_page,
						per_page: industries.per_page,
						total: industries.total,
					}}
					filters={filters}
					routeName="/admin/industries"
					listingName="industry"
					createUrl="/admin/industries/create"
					hasImport={true}
					importUrl="/admin/industries/import"
					importColumns={["name"]}
				/>
			</div>
		</AppLayout>
	);
}
