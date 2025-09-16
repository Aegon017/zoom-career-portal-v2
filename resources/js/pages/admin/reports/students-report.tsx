import { DataTable } from "@/components/data-table";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem, User } from "@/types";
import { Head } from "@inertiajs/react";
import { columns } from "./student-columns";

const breadcrumbs: BreadcrumbItem[] = [
	{ title: "Students Report", href: "/admin/reports/students" },
];

interface Props {
	data: {
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

const StudentsReport = ( { data, filters }: Props ) => {
	const exportFields = [
		{ key: "id", label: "ID", selected: false },
		{ key: "name", label: "Name", selected: true },
		{ key: "email", label: "Email", selected: true },
		{ key: "phone", label: "Phone", selected: true },
		{ key: "total_applied", label: "Jobs Applied", selected: true },
		{ key: "total_shortlisted", label: "Shortlisted", selected: true },
		{ key: "total_hired", label: "Hired", selected: true },
		{ key: "created_at", label: "Registration Date", selected: false },
		{ key: "updated_at", label: "Last Updated", selected: false },
	];

	return (
		<AppLayout breadcrumbs={ breadcrumbs }>
			<Head title="Students Report" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<DataTable
					columns={ columns }
					data={ data.data }
					routeName="/admin/reports/students"
					listingName="student"
					pagination={ {
						current_page: data.current_page,
						last_page: data.last_page,
						per_page: data.per_page,
						total: data.total,
					} }
					filters={ filters }
					hasExport={ true }
					exportUrl="/admin/reports/students/export"
					exportFields={ exportFields }
				/>
			</div>
		</AppLayout>
	);
};

export default StudentsReport;