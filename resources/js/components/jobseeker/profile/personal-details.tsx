import { useEffect, useMemo, useState } from 'react';
import PopupModal from '@/components/popup-modal';
import { useForm, Controller } from 'react-hook-form';
import EditButton from './edit-button';
import Select from 'react-select';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { User } from '@/types';
import { format } from 'date-fns';

interface SelectOption {
    label: string;
    value: string;
}

interface FormData {
    gender: string;
    date_of_birth: string;
    location_id: string;
    marital_status: string;
    work_permit: string[];
    differently_abled: boolean;
}

interface Props {
    isUpdatable: boolean;
    user: User;
}

export default function PersonalDetails( { isUpdatable, user }: Props ) {
    const [ activeModal, setActiveModal ] = useState<string | null>( null );
    const [ locationSearch, setLocationSearch ] = useState( '' );
    const [ locationOptions, setLocationOptions ] = useState<SelectOption[]>( [] );
    const [ countryOptions, setCountryOptions ] = useState<SelectOption[]>( [] );

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>( {
        defaultValues: {
            gender: user.personal_detail?.gender ?? '',
            date_of_birth: user.personal_detail?.date_of_birth
                ? format( new Date( user.personal_detail.date_of_birth ), 'yyyy-MM-dd' )
                : '',
            location_id: user.address?.location?.id?.toString() ?? '',
            marital_status: user.personal_detail?.marital_status ?? '',
            work_permit: user.work_permits?.map( ( wp ) => wp.country ) ?? [],
            differently_abled: user.personal_detail?.differently_abled ?? false,
        }
    } );

    const defaultLocation: SelectOption | null = useMemo( () => {
        return user.address?.location
            ? {
                label: user.address.location.full_name,
                value: user.address.location.id.toString(),
            }
            : null;
    }, [ user.address?.location ] );

    useEffect( () => {
        axios.get( '/location/countries' ).then( ( res ) => {
            if ( res.data.success && Array.isArray( res.data.data ) ) {
                setCountryOptions(
                    res.data.data.map( ( c: any ) => ( {
                        label: c.label || c.country || '',
                        value: c.value?.toString() || c.country || '',
                    } ) )
                );
            }
        } );
    }, [] );

    useEffect( () => {
        if ( locationSearch === '' ) {
            if ( defaultLocation ) {
                setLocationOptions( [ defaultLocation ] );
            } else {
                setLocationOptions( [] );
            }
            return;
        }

        axios
            .get( '/locations/search', { params: { search: locationSearch } } )
            .then( ( res ) => {
                const results = res.data.map( ( loc: any ) => ( {
                    label: loc.label,
                    value: loc.value.toString(),
                } ) );

                if (
                    defaultLocation &&
                    !results.find( ( opt: any ) => opt.value === defaultLocation.value )
                ) {
                    results.unshift( defaultLocation );
                }

                setLocationOptions( results );
            } );
    }, [ locationSearch, defaultLocation ] );

    const openModal = async () => {
        setActiveModal( 'personalDetails' );

        if ( countryOptions.length === 0 ) {
            const res = await axios.get( '/location/countries' );
            if ( res.data.success && Array.isArray( res.data.data ) ) {
                const options = res.data.data.map( ( c: any ) => ( {
                    label: c.label || c.country || '',
                    value: c.value?.toString() || c.country || '',
                } ) );
                setCountryOptions( options );
            }
        }

        reset( {
            gender: user.personal_detail?.gender ?? '',
            date_of_birth: user.personal_detail?.date_of_birth
                ? format( new Date( user.personal_detail.date_of_birth ), 'yyyy-MM-dd' )
                : '',
            location_id: user.address?.location?.id?.toString() ?? '',
            marital_status: user.personal_detail?.marital_status ?? '',
            work_permit: user.work_permits?.map( ( wp ) => wp.country ) ?? [],
            differently_abled: user.personal_detail?.differently_abled ?? false,
        } );
    };


    const closeModal = () => {
        setActiveModal( null );
        reset();
    };

    const onSubmit = ( data: FormData ) =>
        router.post( '/jobseeker/profile/personal-details', { ...data }, {
            onSuccess: closeModal,
            preserveScroll: true
        } );

    return (
        <>
            <div className="zc-profile-personal-details zc-card-style-2 mb-3">
                <div className="zc-card-header d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Personal Details</h3>
                    { isUpdatable && (
                        <EditButton
                            onClick={ openModal }
                            id="edit-personal"
                            ariaLabel="Edit personal details"
                        />
                    ) }
                </div>
                <div className="zc-card-content">
                    <div className="row candidate-personal-details">
                        { [
                            [ 'Gender', user.personal_detail?.gender ],
                            [
                                'Date Of Birth',
                                user.personal_detail?.date_of_birth
                                    ? format(
                                        new Date( user.personal_detail.date_of_birth ),
                                        'dd MMM yyyy'
                                    )
                                    : null,
                            ],
                            [ 'Address', user.address?.location?.full_name ],
                            [ 'Marital Status', user.personal_detail?.marital_status ],
                            [
                                'Work Permit',
                                user.work_permits?.length
                                    ? user.work_permits.map( wp => wp.country ).join( ', ' )
                                    : null,
                            ],
                            [
                                'Differently Abled',
                                user.personal_detail?.differently_abled ? 'Yes' : 'No',
                            ],
                        ].map( ( [ title, value ] ) => (
                            <div key={ title } className="col-lg-6 mb-3">
                                <div className="title">{ title }</div>
                                <div className="value">{ value || 'N/A' }</div>
                            </div>
                        ) ) }
                    </div>
                </div>
            </div>

            <PopupModal
                title="Personal Details"
                isActive={ activeModal === 'personalDetails' }
                onClose={ closeModal }
                onSave={ handleSubmit( onSubmit ) }
            >
                <div className="mb-3">
                    <label>Gender</label>
                    <Controller
                        name="gender"
                        control={ control }
                        rules={ { required: 'Required' } }
                        render={ ( { field } ) => (
                            <select { ...field } className="form-select">
                                <option value="">Select Gender</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                                <option value="Other">Other</option>
                            </select>
                        ) }
                    />
                    { errors.gender && <p className="text-danger">{ errors.gender.message }</p> }
                </div>

                <div className="mb-3">
                    <label>Date of Birth</label>
                    <Controller
                        name="date_of_birth"
                        control={ control }
                        rules={ { required: 'Required' } }
                        render={ ( { field } ) => (
                            <input { ...field } type="date" className="form-control" />
                        ) }
                    />
                    { errors.date_of_birth && (
                        <p className="text-danger">{ errors.date_of_birth.message }</p>
                    ) }
                </div>

                <div className="mb-3">
                    <label>Location</label>
                    <Controller
                        name="location_id"
                        control={ control }
                        rules={ { required: 'Required' } }
                        render={ ( { field } ) => (
                            <Select
                                options={ locationOptions }
                                value={
                                    defaultLocation
                                }
                                onChange={ ( opt ) => field.onChange( opt?.value ?? '' ) }
                                onInputChange={ ( val ) => setLocationSearch( val ) }
                                isClearable
                                placeholder="Search location"
                            />
                        ) }
                    />
                    { errors.location_id && (
                        <p className="text-danger">{ errors.location_id.message }</p>
                    ) }
                </div>

                <div className="mb-3">
                    <label>Marital Status</label>
                    <Controller
                        name="marital_status"
                        control={ control }
                        rules={ { required: 'Required' } }
                        render={ ( { field } ) => (
                            <select { ...field } className="form-select">
                                <option value="">Select Status</option>
                                <option value="Single/unmarried">Single/unmarried</option>
                                <option value="Married">Married</option>
                            </select>
                        ) }
                    />
                    { errors.marital_status && (
                        <p className="text-danger">{ errors.marital_status.message }</p>
                    ) }
                </div>

                <div className="mb-3">
                    <label>Work Permit</label>
                    { countryOptions.length > 0 ? (
                        <Controller
                            name="work_permit"
                            control={ control }
                            render={ ( { field } ) => (
                                <Select
                                    isMulti
                                    options={ countryOptions }
                                    value={ countryOptions.filter( ( o ) =>
                                        field.value.includes( o.value )
                                    ) }
                                    onChange={ ( opts ) =>
                                        field.onChange( opts ? opts.map( ( o ) => o.value ) : [] )
                                    }
                                    placeholder="Select countries"
                                    isClearable
                                />
                            ) }
                        />
                    ) : (
                        <div>Loading work permit options...</div> // or a spinner
                    ) }
                    { errors.work_permit && (
                        <p className="text-danger">{ errors.work_permit.message }</p>
                    ) }
                </div>


                <div className="form-check mb-3">
                    <Controller
                        name="differently_abled"
                        control={ control }
                        render={ ( { field } ) => (
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={ field.value }
                                onChange={ ( e ) => field.onChange( e.target.checked ) }
                                ref={ field.ref }
                            />
                        ) }
                    />
                    <label className="form-check-label">Differently Abled</label>
                </div>
            </PopupModal>
        </>
    );
}
