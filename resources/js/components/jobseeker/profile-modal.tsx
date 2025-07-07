import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import PopupModal from '../popup-modal';
import { router, usePage } from '@inertiajs/react';
import FileUpload from '../file-upload';
import { User } from '@/types';
import IntlTelInput from "intl-tel-input/reactWithUtils";
import "intl-tel-input/styles";
import Select from 'react-select';
import axios from 'axios';

interface ProfileModalProps {
    isActive: boolean;
    handleClose: () => void;
    user: User
}

interface ProfileFormInputs {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    location_id: string;
    experience: string;
    notice_period: string;
    job_title: string;
}

const ProfileModal: React.FC<ProfileModalProps> = ( { isActive, handleClose, user } ) => {
    const { errors: serverErrors } = usePage().props;
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm<ProfileFormInputs>( {
        defaultValues: {
            name: user.name ?? "",
            email: user.email ?? "",
            phone: user.phone ?? "",
            avatar: user.avatar_url ?? "",
            location_id: user.address?.location?.id?.toString() ?? "",
            experience: user.profile?.experience ?? "",
            notice_period: user.profile?.notice_period ?? "",
            job_title: user.profile?.job_title ?? ""
        }
    } );
    const [ locationSearch, setLocationSearch ] = useState( '' );
    const [ locationOptions, setLocationOptions ] = useState<{ label: string; value: string }[]>( [] );

    const defaultLocation = user.address?.location
        ? {
            label: `${ user.address.location.city }, ${ user.address.location.state }, ${ user.address.location.country }`,
            value: user.address.location.id.toString(),
        }
        : null;

    const onSubmit: SubmitHandler<ProfileFormInputs> = ( data: any ) => {
        router.post( "/jobseeker/profile/basic-details", data );
        handleClose();
    };

    useEffect( () => {
        const timeout = setTimeout( () => {
            axios.get( '/locations/search', { params: { search: locationSearch } } )
                .then( res => setLocationOptions( res.data ) );
        }, 300 );

        return () => clearTimeout( timeout );
    }, [ locationSearch ] );

    return (
        <PopupModal
            isActive={ isActive }
            title="Profile Summary"
            onClose={ handleClose }
            onSave={ handleSubmit( onSubmit ) }
        >
            <div className="modal-body overflow-auto" style={ { maxHeight: '400px' } }>
                <div className="mb-3">
                    <label htmlFor="file" className="form-label">Profile image:</label>
                    <FileUpload
                        acceptedFileTypes={ [ 'image/*' ] }
                        placeholder="Upload profile image"
                        name="file"
                        onUploaded={ ( url ) => setValue( "avatar", url ) }
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name:</label>
                    <input
                        type="text"
                        className="form-control"
                        { ...register( 'name' ) }
                    />
                    { serverErrors.name && <p className="text-danger">Name is required</p> }
                </div>

                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email:</label>
                    <input
                        type="email"
                        className="form-control"
                        { ...register( 'email' ) }
                    />
                    { serverErrors.email && <p className="text-danger">Email is required</p> }
                </div>

                <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone:</label>
                    <IntlTelInput
                        initialValue={ user.phone }
                        onChangeNumber={ ( value: string ) => setValue( 'phone', value ) }
                        inputProps={ { className: "form-control block w-full" } }
                    />
                    { serverErrors.phone && <p className="text-danger">Phone is required</p> }
                </div>

                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Job title:</label>
                    <input
                        type="text"
                        className="form-control"
                        { ...register( 'job_title' ) }
                    />
                    { serverErrors.job_title && <p className="text-danger">Job <title></title> is required</p> }
                </div>

                <div className="mb-3">
                    <label htmlFor="location" className="form-label">Location:</label>
                    <Select
                        options={ locationOptions }
                        defaultValue={ defaultLocation || ( user.address?.location?.city ? { label: user.address.location.city, value: user.address.location.city } : null ) }
                        onChange={ ( selectedOption ) => {
                            setValue( 'location_id', selectedOption?.value || "" );
                        } }
                        onInputChange={ ( inputValue ) => setLocationSearch( inputValue ) }
                        isClearable
                        placeholder="Select or search location"
                    />
                    { serverErrors.location_id && <p className="text-danger">Location is required</p> }
                </div>

                <div className="mb-3">
                    <label htmlFor="experience" className="form-label">Experience:</label>
                    <input
                        type="text"
                        className="form-control"
                        { ...register( 'experience' ) }
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="notice_period" className="form-label">Notice Period:</label>
                    <input
                        type="text"
                        className="form-control"
                        { ...register( 'notice_period' ) }
                    />
                </div>
            </div>
        </PopupModal>
    );
};

export default ProfileModal;
