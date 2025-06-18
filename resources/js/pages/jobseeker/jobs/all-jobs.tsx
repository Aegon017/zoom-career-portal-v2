import { useEffect, useState } from "react"
import { router, Head, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/jobseeker-layout"
import OpeningItem from "@/components/jobseeker/opening-item"
import { Opening } from "@/types"
import JobFilters from "@/components/jobseeker/job-filter"

type JobDetailsProps = {
    jobs: Opening[]
    filters: {
        company?: string
        job_title?: string
        employment_types?: string[]
        industries?: string[]
    }
}

const JobDetails = ({ jobs, filters }: JobDetailsProps) => {
    const { data, setData } = useForm({
        company: filters?.company || '',
        job_title: filters?.job_title || '',
        employment_types: filters?.employment_types || [],
        industries: filters?.industries || [],
    })

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('jobseeker.jobs.index'), data, { preserveState: true, replace: true })
        }, 300)
        return () => clearTimeout(timeout)
    }, [data])

    const toggleArray = (key: 'employment_types' | 'industries', value: string) => {
        setData(key, data[key].includes(value)
            ? data[key].filter((v: string) => v !== value)
            : [...data[key], value])
    }

    return (
        <AppLayout>
            <Head title="Job details" />
            <div className="page-title px-4">
                <h2>Jobs</h2>
            </div>
            <div className="zc-main-jobs-wrapper">
                <div className="zc-container">
                    <div className="row">
                        <div className="col-lg-4">
                            <JobFilters filters={filters} />
                        </div>
                        <div className="col-lg-8">
                            <div className="zc-card">
                                {jobs.map(job => (
                                    <div key={job.id} className="mb-3">
                                        <OpeningItem opening={job} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default JobDetails
