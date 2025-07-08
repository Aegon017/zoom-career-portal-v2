import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import PopupModal from '@/components/popup-modal';
import EditButton from './edit-button';
import axios from 'axios';
import { Certificate, User } from '@/types';
import { router } from '@inertiajs/react';

interface Props {
    isUpdatable: boolean;
    user: User;
}

interface CertificateFormData {
    certifications: Certificate[];
}

export default function Certifications( { isUpdatable, user }: Props ) {
    const { control, handleSubmit, reset } = useForm<CertificateFormData>( {
        defaultValues: {
            certifications: user.certificates || [],
        },
    } );

    const { fields, append, remove } = useFieldArray( {
        control,
        name: 'certifications',
    } );

    const [ activeModal, setActiveModal ] = useState( false );

    const openModal = () => {
        reset( {
            certifications: user.certificates || [],
        } );
        setActiveModal( true );
    };

    const closeModal = () => setActiveModal( false );

    const onSubmit = ( data: CertificateFormData ) => {
        const payload = data.certifications.map( cert => ( {
            name: cert.name,
        } ) );

        router.post( '/jobseeker/profile/certificates', {
            certifications: payload,
        }, {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: ( errors ) => {
                console.error( 'Validation errors:', errors );
            },
        } );
    };


    return (
        <>
            <div className="zc-profile-certification zc-card-style-2 mb-3">
                <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                    <div className="text">
                        <h3 className="mb-0">Certification</h3>
                        <p className="mb-0">Add details of certifications you have completed</p>
                    </div>
                    { isUpdatable && (
                        <EditButton onClick={ openModal } />
                    ) }
                </div>

                <div className="zc-card-content">
                    <div className="certificate-list">
                        { user.certificates.length ? (
                            user.certificates.map( ( cert ) => (
                                <div key={ cert.id || cert.name } className="certificate-list-item d-flex align-items-start gap-2">
                                    <div className="icon">
                                        <svg fill="#000000" width="40" height="40" viewBox="0 0 36 36" version="1.1" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
                                            <path d="M32,6H4A2,2,0,0,0,2,8V28a2,2,0,0,0,2,2H19l.57-.7.93-1.14L20.41,28H4V8H32l0,8.56a8.41,8.41,0,0,1,2,1.81V8A2,2,0,0,0,32,6Z" className="clr-i-outline clr-i-outline-path-1"></path>
                                            <rect x="7" y="12" width="17" height="1.6" className="clr-i-outline clr-i-outline-path-2"></rect>
                                            <rect x="7" y="16" width="11" height="1.6" className="clr-i-outline clr-i-outline-path-3"></rect>
                                            <rect x="7" y="23" width="10" height="1.6" className="clr-i-outline clr-i-outline-path-4"></rect>
                                            <path d="M27.46,17.23a6.36,6.36,0,0,0-4.4,11l-1.94,2.37.9,3.61,3.66-4.46a6.26,6.26,0,0,0,3.55,0l3.66,4.46.9-3.61-1.94-2.37a6.36,6.36,0,0,0-4.4-11Zm0,10.68a4.31,4.31,0,1,1,4.37-4.31A4.35,4.35,0,0,1,27.46,27.91Z" className="clr-i-outline clr-i-outline-path-5"></path>
                                        </svg>
                                    </div>
                                    <div className="info my-auto">
                                        <div className="title d-flex gap-2 align-items-center">
                                            <h3 className="certificate-name m-0">{ cert.name }</h3>
                                        </div>
                                    </div>
                                </div>
                            ) )
                        ) : (
                            <p>No certifications added yet.</p>
                        ) }
                    </div>
                </div>
            </div>

            <PopupModal title="Edit Certifications" isActive={ activeModal } onClose={ closeModal } onSave={ handleSubmit( onSubmit ) }>
                <div>
                    { fields.map( ( field, index ) => (
                        <div key={ field.id } className="mb-4 border-bottom pb-3">
                            <label>Certification Name</label>
                            <Controller
                                name={ `certifications.${ index }.name` as const }
                                control={ control }
                                rules={ { required: 'Certification name is required' } }
                                render={ ( { field } ) => (
                                    <input
                                        type="text"
                                        { ...field }
                                        className="form-control"
                                        placeholder="Enter certification name"
                                    />
                                ) }
                            />

                            {/* Optional: issued_by or date fields */ }
                            {/* <label>Issued By</label>
              <Controller
                name={`certifications.${index}.issued_by` as const}
                control={control}
                render={({ field }) => (
                  <input type="text" {...field} className="form-control" placeholder="Issued by" />
                )}
              /> */}

                            <button
                                type="button"
                                className="btn btn-danger btn-sm mt-2"
                                onClick={ () => remove( index ) }
                            >
                                Remove
                            </button>
                        </div>
                    ) ) }

                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={ () => append( { name: '' } ) }
                    >
                        Add Certification
                    </button>
                </div>
            </PopupModal>
        </>
    );
}
