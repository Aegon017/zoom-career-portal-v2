import StatsWidget from "@/components/widgets/stats-widget";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import {
	Briefcase,
	BriefcaseBusiness,
	BriefcaseConveyorBelt,
	Building2,
	Factory,
	FileCheck,
	FileX,
	GraduationCap,
	User,
	UserCheck,
	UserCog,
	UserPlus,
	Users,
} from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
	{
		title: "Admin Dashboard",
		href: "/admin/dashboard",
	},
];

interface Props {
	noOfStudents: number;
	noOfRecruiters: number;
	noOfCompanies: number;
	noOfJobs: number;
	noOfActiveJobs: number;
	noOfClosedJobs: number;
	noOfActiveApplicants: number;
	noOfShortlistedApplicants: number;
	noOfHiredApplicants: number;
}

const AdminDashboard = ({
	noOfStudents,
	noOfRecruiters,
	noOfCompanies,
	noOfJobs,
	noOfActiveJobs,
	noOfClosedJobs,
	noOfActiveApplicants,
	noOfShortlistedApplicants,
	noOfHiredApplicants,
}: Props) => {
	return (
		<AppLayout breadcrumbs={breadcrumbs}>
			<Head title="Admin dashboard" />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<div className="grid auto-rows-min gap-4 md:grid-cols-3">
					<StatsWidget
						title="Total Students"
						icon={GraduationCap}
						stat={noOfStudents}
						description="Total number of registered students"
						bgColor="bg-sky-600"
						textColor="text-sky-600"
						href="/admin/students"
					/>

					<StatsWidget
						title="Total Recruiters"
						icon={UserCheck}
						stat={noOfRecruiters}
						description="Total number of verified recruiters"
						bgColor="bg-blue-600"
						textColor="text-blue-600"
						href="/admin/recruiters"
					/>

					<StatsWidget
						title="Total Companies"
						icon={Factory}
						stat={noOfCompanies}
						description="Total number of partnered companies"
						bgColor="bg-emerald-600"
						textColor="text-emerald-600"
						href="/admin/companies"
					/>

					<StatsWidget
						title="Total Jobs"
						icon={BriefcaseBusiness}
						stat={noOfJobs}
						description="Total job postings across companies"
						bgColor="bg-indigo-600"
						textColor="text-indigo-600"
						href="/admin/jobs"
					/>

					<StatsWidget
						title="Active Jobs"
						icon={FileCheck}
						stat={noOfActiveJobs}
						description="Jobs currently open for applications"
						bgColor="bg-green-600"
						textColor="text-green-600"
						href="/admin/jobs"
					/>

					<StatsWidget
						title="Closed Jobs"
						icon={FileX}
						stat={noOfClosedJobs}
						description="Jobs that are no longer accepting applications"
						bgColor="bg-rose-600"
						textColor="text-rose-600"
						href="/admin/jobs"
					/>

					<StatsWidget
						title="Active Applicants"
						icon={Users}
						stat={noOfActiveApplicants}
						description="Applicants actively applying to jobs"
						bgColor="bg-purple-600"
						textColor="text-purple-600"
					/>

					<StatsWidget
						title="Shortlisted Applicants"
						icon={UserCog}
						stat={noOfShortlistedApplicants}
						description="Applicants shortlisted for interviews"
						bgColor="bg-amber-600"
						textColor="text-amber-600"
					/>

					<StatsWidget
						title="Hired Applicants"
						icon={UserPlus}
						stat={noOfHiredApplicants}
						description="Applicants successfully hired"
						bgColor="bg-teal-600"
						textColor="text-teal-600"
					/>
				</div>
			</div>
		</AppLayout>
	);
};

export default AdminDashboard;
