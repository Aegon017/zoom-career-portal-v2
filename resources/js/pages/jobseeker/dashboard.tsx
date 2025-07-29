import OpeningItem from '@/components/jobseeker/opening-item';
import StatsWidget from '@/components/widgets/stats-widget';
import JobseekerLayout from '@/layouts/jobseeker-layout';
import { Opening } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { BadgeCheck, Bookmark, Briefcase, ClipboardList, UserCheck } from 'lucide-react';

interface Props {
    noOfJobs: number;
    noOfAppliedJobs: number;
    noOfSavedJobs: number;
    noOfShortlistedJobs: number;
    noOfHiredJobs: number;
}

const Dashboard = ( { noOfJobs, noOfAppliedJobs, noOfSavedJobs, noOfShortlistedJobs, noOfHiredJobs }: Props ) => {

    return (
        <JobseekerLayout>
            <Head title="Explore" />
            <div className="zc-jobs-by-interest-sec">
                <div className="zc-container">
                    <div className="page-title">
                        <h2>Explore</h2>
                    </div>
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <StatsWidget
                            title="Total Jobs"
                            icon={ Briefcase }
                            stat={ noOfJobs }
                            description="Total number of Jobs"
                            bgColor="bg-blue-600"
                            textColor="text-blue-600"
                        />

                        <StatsWidget
                            title="Total Applied Jobs"
                            icon={ ClipboardList }
                            stat={ noOfAppliedJobs }
                            description="Total number of applied jobs"
                            bgColor="bg-yellow-500"
                            textColor="text-yellow-500"
                        />

                        <StatsWidget
                            title="Total Saved Jobs"
                            icon={ Bookmark }
                            stat={ noOfSavedJobs }
                            description="Total number of saved jobs"
                            bgColor="bg-indigo-600"
                            textColor="text-indigo-600"
                        />

                        <StatsWidget
                            title="Total Shortlisted Jobs"
                            icon={ UserCheck }
                            stat={ noOfShortlistedJobs }
                            description="Total number of shortlisted jobs"
                            bgColor="bg-pink-600"
                            textColor="text-pink-600"
                        />

                        <StatsWidget
                            title="Total Hired Jobs"
                            icon={ BadgeCheck }
                            stat={ noOfHiredJobs }
                            description="Total number of hired jobs"
                            bgColor="bg-green-600"
                            textColor="text-green-600"
                        />
                    </div>
                </div>
            </div>
        </JobseekerLayout>
    );
};

export default Dashboard;
