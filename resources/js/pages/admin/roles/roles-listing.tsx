import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, Role } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./role-columns";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Roles",
		href: "/admin/roles",
	},
];

interface Props {
	roles: {
		data: Role[];
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

export default function RolesListing({ roles, filters }: Props) {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Roles" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					columns={columns}
					data={roles.data}
					pagination={{
						current_page: roles.current_page,
						last_page: roles.last_page,
						per_page: roles.per_page,
						total: roles.total,
					}}
					filters={filters}
					routeName="/admin/roles"
					listingName="role"
					createUrl="/admin/roles/create"
				/>
			</div>
		</AppLayout>
	);
}
