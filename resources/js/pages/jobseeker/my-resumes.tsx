import FileUpload from '@/components/file-upload';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import AppLayout from '@/layouts/jobseeker-layout';
import { Head, router } from '@inertiajs/react';
import { Eye, File, Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Resume {
    id: number;
    name: string;
    url: string;
    uploaded_at: string;
}

type FormValues = {
    resume: string | null;
};

export default function MyResumes( { resumes, errors: backendErrors }: { resumes: Resume[]; errors: any } ) {
    const form = useForm<FormValues>( {
        defaultValues: {
            resume: null,
        },
    } );

    const { handleSubmit, control, setValue, watch, reset, setError } = form;
    const file = watch( 'resume' );
    const [ showDeleteModal, setShowDeleteModal ] = useState( false );
    const [ resumeToDelete, setResumeToDelete ] = useState<number | null>( null );
    const modalRef = useRef<HTMLDivElement>( null );

    useEffect( () => {
        function handleClickOutside( event: MouseEvent ) {
            if ( modalRef.current && !modalRef.current.contains( event.target as Node ) ) {
                setShowDeleteModal( false );
            }
        }

        if ( showDeleteModal ) {
            document.addEventListener( 'mousedown', handleClickOutside );
        }

        return () => {
            document.removeEventListener( 'mousedown', handleClickOutside );
        };
    }, [ showDeleteModal ] );

    const onSubmit = async ( data: FormValues ) => {
        if ( !data.resume ) return;

        router.post(
            '/jobseeker/resumes',
            { resume: data.resume },
            {
                onSuccess: () => {
                    reset();
                },
                onError: ( errors ) => {
                    if ( errors.resume ) {
                        setError( 'resume', {
                            type: 'manual',
                            message: errors.resume,
                        } );
                    } else {
                        toast.error( 'Upload failed' );
                    }
                },
            },
        );
    };

    const openDeleteModal = ( id: number ) => {
        setResumeToDelete( id );
        setShowDeleteModal( true );
    };

    const confirmDelete = () => {
        if ( resumeToDelete ) {
            router.delete( `/jobseeker/resumes/destroy/${ resumeToDelete }`, {
                onSuccess: () => {
                    toast.success( 'Resume deleted successfully' );
                    setShowDeleteModal( false );
                },
                onError: () => {
                    toast.error( 'Failed to delete resume' );
                    setShowDeleteModal( false );
                },
            } );
        }
    };

    useEffect( () => {
        if ( backendErrors?.message ) {
            toast.error( backendErrors.message );
        }
    }, [ backendErrors ] );

    return (
        <AppLayout>
            <Head title="My Resumes" />
            <div className="zc-job-details-wrapper py-4">
                <div className="zc-container">
                    <div className="page-title mb-4">
                        <h2>My Resumes</h2>
                    </div>

                    {/* Display general backend errors */ }
                    { backendErrors?.message && <div className="alert alert-danger mb-4">{ backendErrors.message }</div> }

                    <div className="row g-4">
                        <div className="col-lg-5">
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Upload Resume</h5>
                                    <Form { ...form }>
                                        <form onSubmit={ handleSubmit( onSubmit ) }>
                                            <FormField
                                                control={ control }
                                                name="resume"
                                                render={ ( { field, fieldState } ) => (
                                                    <FormItem>
                                                        <FormLabel className="form-label">Resume (PDF only : Max file size 1MB)</FormLabel>
                                                        <FormControl>
                                                            <FileUpload
                                                                placeholder="Upload your resume"
                                                                name="file"
                                                                acceptedFileTypes={ [ 'application/pdf' ] }
                                                                onUploaded={ ( path ) => setValue( 'resume', path ) }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                ) }
                                            />
                                            <button className="btn btn-primary mt-3 w-100" type="submit" disabled={ !file }>
                                                Upload Resume
                                            </button>
                                        </form>
                                    </Form>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7">
                            <div className="card h-100 shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">Uploaded Resumes</h5>
                                    { resumes.length === 0 ? (
                                        <div className="text-muted">No resumes uploaded yet.</div>
                                    ) : (
                                        <ul className="list-group list-group-flush">
                                            { resumes.map( ( resume ) => (
                                                <li
                                                    key={ resume.id }
                                                    className="list-group-item d-flex justify-content-between align-items-start border-bottom align-items-center"
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <File size={ 20 } className="text-danger" />
                                                        <div>
                                                            <div className="fw-semibold">{ resume.name }</div>
                                                            <div className="small text-muted">
                                                                Uploaded: { new Date( resume.uploaded_at ).toLocaleString() }
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex gap-2">
                                                        <a
                                                            href={ resume.url }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                                                        >
                                                            <Eye className="me-1" />
                                                            View
                                                        </a>
                                                        <button
                                                            onClick={ () => openDeleteModal( resume.id ) }
                                                            className="btn btn-sm btn-outline-danger d-flex align-items-center"
                                                        >
                                                            <Trash className="me-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </li>
                                            ) ) }
                                        </ul>
                                    ) }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap-style Modal using React state */ }
            { showDeleteModal && <div className="modal-backdrop fade show"></div> }
            <div className={ `modal fade ${ showDeleteModal ? 'show d-block' : 'd-none' }` } tabIndex={ -1 } style={ { backgroundColor: 'rgba(0,0,0,0.5)' } }>
                <div className="modal-dialog" ref={ modalRef }>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button type="button" className="btn-close" onClick={ () => setShowDeleteModal( false ) }></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete this resume? This action cannot be undone.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={ () => setShowDeleteModal( false ) }>
                                Cancel
                            </button>
                            <button type="button" className="btn btn-danger" onClick={ confirmDelete }>
                                Delete Resume
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
