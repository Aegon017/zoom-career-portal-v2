import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { Company, type BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { columns } from "./company-columns";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Companies",
		href: "/admin/companies",
	},
];

interface Props {
	companies: {
		data: Company[];
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

export default function CompaniesListing({ companies, filters }: Props) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Companies" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					hasCreate={true}
					columns={columns}
					data={companies.data}
					pagination={{
						current_page: companies.current_page,
						last_page: companies.last_page,
						per_page: companies.per_page,
						total: companies.total,
					}}
					filters={filters}
					routeName="/admin/companies"
					listingName="company"
					createUrl="/admin/companies/create"
					hasExport={true}
					exportUrl="/admin/companies/export"
					exportFields={[
						{ key: "name", label: "Name", selected: true },
						{ key: "email", label: "Email", selected: true },
						{ key: "phone", label: "Phone", selected: true },
						{ key: "industry_id", label: "Industry", selected: true },
						{ key: "website_url", label: "Website", selected: true },
						{ key: "size", label: "Company Size", selected: true },
						{ key: "type", label: "Company Type", selected: true },
						{
							key: "verification_status",
							label: "Verification Status",
							selected: true,
						},
						{
							key: "match_score_cutoff",
							label: "Match Score Cutoff",
							selected: true,
						},
					]}
				/>
			</div>
		</AppLayout>
	);
}
