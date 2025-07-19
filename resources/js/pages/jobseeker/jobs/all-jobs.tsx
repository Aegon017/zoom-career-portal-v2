import { useCallback, useEffect, useState } from "react";
import { router, Head, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/jobseeker-layout";
import OpeningItem from "@/components/jobseeker/opening-item";
import { Opening, Option } from "@/types";
import JobFilters from "@/components/jobseeker/job-filter";

type Props = {
    initialJobs: {
        data: Opening[];
        next_page_url: string | null;
    };
    employmentTypes: Option[];
    industries: Array<{ id: number; name: string }>;
    filters: {
        company?: string;
        job_title?: string;
        employment_types?: string[];
        industries?: string[];
    };
};

const AllJobs = ( { initialJobs, employmentTypes, industries, filters }: Props ) => {
    const { props } = usePage<Props>();
    const [ jobs, setJobs ] = useState<Opening[]>( initialJobs.data );
    const [ nextPageUrl, setNextPageUrl ] = useState<string | null>( initialJobs.next_page_url );
    const [ loading, setLoading ] = useState( false );

    // Update jobs when props change
    useEffect( () => {
        setJobs( props.initialJobs.data );
        setNextPageUrl( props.initialJobs.next_page_url );
    }, [ props.initialJobs ] );

    const loadMore = useCallback( () => {
        if ( !nextPageUrl || loading ) return;

        setLoading( true );
        router.get( nextPageUrl, {}, {
            preserveScroll: true,
            preserveState: true,
            only: [ 'initialJobs' ],
            onSuccess: ( page ) => {
                const newJobs = page.props.initialJobs as {
                    data: Opening[];
                    next_page_url: string | null;
                };
                setJobs( prev => [ ...prev, ...newJobs.data ] );
                setNextPageUrl( newJobs.next_page_url );
                setLoading( false );
            },
            onError: () => setLoading( false ),
        } );
    }, [ nextPageUrl, loading ] );

    return (
        <AppLayout>
            <Head title="Jobs" />
            <div className="zc-main-jobs-wrapper">
                <div className="zc-container">
                    <div className="page-title px-4">
                        <h2>Jobs</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <JobFilters
                                filters={ filters }
                                employmentOptions={ employmentTypes }
                                industries={ industries }
                            />
                        </div>
                        <div className="col-lg-8">
                            <div className="zc-card">
                                { jobs.length === 0 ? (
                                    <div className="text-center py-5">
                                        <p>No jobs found. Try adjusting your filters.</p>
                                    </div>
                                ) : (
                                    jobs.map( ( job ) => (
                                        <div key={ job.id } className="mb-3">
                                            <OpeningItem opening={ job } />
                                        </div>
                                    ) )
                                ) }
                            </div>
                            { nextPageUrl && jobs.length > 0 && (
                                <div className="load-more-wrapper text-center mt-4">
                                    <button
                                        className="btn btn-primary"
                                        onClick={ loadMore }
                                        disabled={ loading }
                                    >
                                        { loading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        ) : null }
                                        { loading ? 'Loading...' : 'Load More' }
                                    </button>
                                </div>
                            ) }
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default AllJobs;