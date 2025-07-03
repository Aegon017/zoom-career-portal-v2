import { useCallback, useEffect, useState } from "react"
import { router, Head, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/jobseeker-layout"
import OpeningItem from "@/components/jobseeker/opening-item"
import { Opening } from "@/types"
import JobFilters from "@/components/jobseeker/job-filter"

type Props = {
    initialJobs: any
    filters: {
        company?: string
        job_title?: string
        employment_types?: string[]
        industries?: string[]
    }
}

const AllJobs = ( { initialJobs, filters }: Props ) => {
    const { data, setData } = useForm( {
        company: filters?.company || '',
        job_title: filters?.job_title || '',
        employment_types: filters?.employment_types || [],
        industries: filters?.industries || [],
    } )

    const [ jobs, setJobs ] = useState( initialJobs.data )
    const [ nextPageUrl, setNextPageUrl ] = useState( initialJobs.next_page_url )
    const [ loading, setLoading ] = useState( false )

    const loadMore = useCallback( () => {
        if ( !nextPageUrl || loading ) return
        setLoading( true )
        router.get( nextPageUrl, {}, {
            preserveScroll: true,
            preserveState: true,
            only: [ 'companies' ],
            onSuccess: ( page ) => {
                const companies = page.props.companies as { data: Opening[]; next_page_url: string | null }
                setJobs( ( prev: Opening[] ) => [ ...prev, ...companies.data ] )
                setNextPageUrl( companies.next_page_url )
                setLoading( false )
            },
        } )
    }, [ nextPageUrl, loading ] )

    useEffect( () => {
        const timeout = setTimeout( () => {
            router.get( '/jobseeker/jobs', data, {
                preserveState: true,
                replace: true,
            } )
        }, 300 )
        return () => clearTimeout( timeout )
    }, [ data ] )

    return (
        <AppLayout>
            <Head title="Job details" />
            <div className="zc-main-jobs-wrapper">
                <div className="zc-container">
                    <div className="page-title px-4">
                        <h2>Jobs</h2>
                    </div>
                    <div className="row">
                        { jobs.length > 0 && (
                            <div className="col-lg-4">
                                <JobFilters filters={ filters } />
                            </div>
                        ) }
                        <div className={ jobs.length > 0 ? "col-lg-8" : "col-lg-12" }>
                            <div className="zc-card">
                                { jobs.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p>No jobs found.</p>
                                    </div>
                                ) : (
                                    jobs.map( ( job: Opening ) => (
                                        <div key={ job.id } className="mb-3">
                                            <OpeningItem opening={ job } />
                                        </div>
                                    ) )
                                ) }
                            </div>
                            { nextPageUrl && jobs.length > 0 && (
                                <div className="load-more-wrapper text-center">
                                    <button onClick={ loadMore } disabled={ loading }>
                                        { loading ? 'Loading...' : 'Load More' }
                                    </button>
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default AllJobs
