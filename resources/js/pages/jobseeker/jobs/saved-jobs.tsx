import OpeningItem from "@/components/jobseeker/opening-item"
import AppLayout from "@/layouts/jobseeker-layout"
import { Opening } from "@/types"
import { Head, router } from "@inertiajs/react"
import { useCallback, useState } from "react";

interface Props {
    initialJobs: {
        data: Opening[];
        next_page_url: string
    };
    count: number;
}

const SavedJobsListing = ( { initialJobs }: Props ) => {
    const [ jobs, setJobs ] = useState( initialJobs.data );
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
                setNextPageUrl( initialJobs.next_page_url )
                setLoading( false )
            },
        } )
    }, [ nextPageUrl, loading ] )
    return (
        <AppLayout>
            <Head title="Explore" />
            <div className="zc-container">
                <div className="page-title px-4">
                    <h2 className="mt-0">Saved Jobs</h2>
                </div>
                <div className="zc-saved-jobs-wrapper zc-card">
                    <div className="zc-job-list">
                        {
                            !jobs ? (
                                <div className="text-center py-8 text-gray-500">
                                    You have no saved jobs yet.
                                </div>
                            ) : (
                                <>
                                    { jobs.map( ( job: Opening ) => (
                                        <OpeningItem key={ job.id } opening={ job } />
                                    ) ) }
                                    { nextPageUrl && (
                                        <div className="load-more-wrapper text-center">
                                            <button onClick={ loadMore } disabled={ loading }>
                                                { loading ? 'Loading...' : 'Load More' }
                                            </button>
                                        </div>
                                    ) }
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

export default SavedJobsListing