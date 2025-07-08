import { useEffect, useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import Select from 'react-select';
import axios from 'axios';
import PopupModal from '@/components/popup-modal';
import EditButton from './edit-button';
import { User } from '@/types';
import { router } from '@inertiajs/react';

interface Props {
    isUpdatable: boolean;
    user: User;
}

type Proficiency = 'Beginner' | 'Intermediate' | 'Proficient' | 'Fluent' | 'Native';

interface LanguageFormItem {
    language_id: string;
    proficiency: Proficiency | '';
    can_read: boolean;
    can_write: boolean;
    can_speak: boolean;
}

interface LanguageFormData {
    languages: LanguageFormItem[];
}

interface SelectOption {
    label: string;
    value: string;
}

export default function Languages( { isUpdatable, user }: Props ) {
    const { control, handleSubmit, reset } = useForm<LanguageFormData>( {
        defaultValues: {
            languages: user.user_languages?.map( ( ul: any ) => ( {
                language_id: ul.language.id.toString(),
                proficiency: ul.proficiency,
                can_read: ul.can_read,
                can_write: ul.can_write,
                can_speak: ul.can_speak,
            } ) ) || [],
        },
    } );

    const { fields, append, remove } = useFieldArray( {
        control,
        name: 'languages',
    } );

    const [ activeModal, setActiveModal ] = useState( false );
    const [ languageOptions, setLanguageOptions ] = useState<SelectOption[]>( [] );
    const [ languageSearch, setLanguageSearch ] = useState( '' );

    useEffect( () => {
        if ( languageSearch === '' ) {
            setLanguageOptions( [] );
            return;
        }

        const fetchLanguages = async () => {
            try {
                const res = await axios.get( '/languages/search', {
                    params: { search: languageSearch },
                } );
                if ( res.data.success && Array.isArray( res.data.data ) ) {
                    setLanguageOptions(
                        res.data.data.map( ( lang: any ) => ( {
                            label: lang.name,
                            value: lang.id.toString(),
                        } ) )
                    );
                }
            } catch ( err ) {
                console.error( 'Failed to fetch languages', err );
            }
        };

        fetchLanguages();
    }, [ languageSearch ] );

    const openModal = () => {
        reset( {
            languages: user.user_languages?.map( ( ul: any ) => ( {
                language_id: ul.language.id.toString(),
                proficiency: ul.proficiency,
                can_read: ul.can_read,
                can_write: ul.can_write,
                can_speak: ul.can_speak,
            } ) ) || [],
        } );
        setActiveModal( true );
    };

    const closeModal = () => {
        setActiveModal( false );
    };

    const onSubmit = ( data: LanguageFormData ) => {
        const formData: Record<string, any> = {};

        data.languages.forEach( ( language, index ) => {
            formData[ `languages[${ index }][language_id]` ] = language.language_id;
            formData[ `languages[${ index }][proficiency]` ] = language.proficiency;
            formData[ `languages[${ index }][can_read]` ] = language.can_read ? 1 : 0;
            formData[ `languages[${ index }][can_write]` ] = language.can_write ? 1 : 0;
            formData[ `languages[${ index }][can_speak]` ] = language.can_speak ? 1 : 0;
        } );

        router.post( '/jobseeker/profile/languages', {
            languages: data.languages,
        } as Record<string, any>, {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: ( errors ) => {
                console.error( 'Validation errors:', errors );
            },
        } );

    };

    function capitalize( s: string ) {
        return s.charAt( 0 ).toUpperCase() + s.slice( 1 );
    }

    return (
        <>
            <div className="zc-profile-candidate-languages zc-card-style-2 mb-3">
                <div className="zc-card-header d-flex align-items-center justify-content-between gap-2">
                    <h3 className="mb-0">Languages</h3>
                    { isUpdatable && <EditButton onClick={ openModal } /> }
                </div>
                <div className="zc-card-content">
                    <div className="language-list">
                        { user.user_languages && user.user_languages.length > 0 ? (
                            user.user_languages.map( ( ul ) => (
                                <div key={ ul.id } className="language-list-item">
                                    <div className="row top">
                                        <div className="col-6 mb-2">
                                            <div className="title">Language</div>
                                            <div className="content">{ ul.language.name }</div>
                                        </div>
                                        <div className="col-6 mb-2">
                                            <div className="title">Proficiency</div>
                                            <div className="content">{ capitalize( ul.proficiency ) }</div>
                                        </div>
                                    </div>
                                    <div className="bottom">
                                        <ul>
                                            <li>{ ul.can_read ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-xmark" /> } Read</li>
                                            <li>{ ul.can_write ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-xmark" /> } Write</li>
                                            <li>{ ul.can_speak ? <i className="fa-solid fa-check" /> : <i className="fa-solid fa-xmark" /> } Speak</li>
                                        </ul>
                                    </div>
                                </div>
                            ) )
                        ) : (
                            <p>No languages added yet.</p>
                        ) }
                    </div>
                </div>
            </div>

            <PopupModal title="Edit Languages" isActive={ activeModal } onClose={ closeModal } onSave={ handleSubmit( onSubmit ) }>
                <div>
                    { fields.map( ( field, index ) => (
                        <div key={ field.id } className="mb-4 border-bottom pb-3">
                            <label>Language</label>
                            <Controller
                                control={ control }
                                name={ `languages.${ index }.language_id` as const }
                                rules={ { required: 'Language is required' } }
                                render={ ( { field } ) => {
                                    const selectedOption =
                                        languageOptions.find( ( o ) => o.value === field.value ) ??
                                        ( field.value
                                            ? {
                                                label: user.user_languages?.find( ( ul: any ) => ul.language.id.toString() === field.value )?.language.name ?? 'Loading...',
                                                value: field.value,
                                            }
                                            : null );

                                    return (
                                        <Select
                                            options={ languageOptions }
                                            onInputChange={ ( val ) => setLanguageSearch( val ) }
                                            onChange={ ( opt ) => field.onChange( opt?.value ?? '' ) }
                                            value={ selectedOption }
                                            placeholder="Search language..."
                                            isClearable
                                        />
                                    );
                                } }
                            />
                            <label className="mt-2">Proficiency</label>
                            <Controller
                                control={ control }
                                name={ `languages.${ index }.proficiency` as const }
                                rules={ { required: 'Proficiency is required' } }
                                render={ ( { field } ) => (
                                    <select { ...field } className="form-select">
                                        <option value="">Select proficiency</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="proficient">Proficient</option>
                                        <option value="fluent">Fluent</option>
                                        <option value="native">Native</option>
                                    </select>
                                ) }
                            />
                            <div className="form-check form-check-inline mt-2">
                                <Controller
                                    control={ control }
                                    name={ `languages.${ index }.can_read` as const }
                                    render={ ( { field } ) => (
                                        <input type="checkbox" className="form-check-input" onChange={ ( e ) => field.onChange( e.target.checked ) } checked={ field.value } />
                                    ) }
                                />
                                <label className="form-check-label">Read</label>
                            </div>
                            <div className="form-check form-check-inline mt-2">
                                <Controller
                                    control={ control }
                                    name={ `languages.${ index }.can_write` as const }
                                    render={ ( { field } ) => (
                                        <input type="checkbox" className="form-check-input" onChange={ ( e ) => field.onChange( e.target.checked ) } checked={ field.value } />
                                    ) }
                                />
                                <label className="form-check-label">Write</label>
                            </div>
                            <div className="form-check form-check-inline mt-2">
                                <Controller
                                    control={ control }
                                    name={ `languages.${ index }.can_speak` as const }
                                    render={ ( { field } ) => (
                                        <input type="checkbox" className="form-check-input" onChange={ ( e ) => field.onChange( e.target.checked ) } checked={ field.value } />
                                    ) }
                                />
                                <label className="form-check-label">Speak</label>
                            </div>
                            <button
                                type="button"
                                className="btn btn-danger btn-sm mt-2"
                                onClick={ () => remove( index ) }
                            >
                                Remove
                            </button>
                        </div>
                    ) ) }

                    <button type="button" className="btn btn-primary" onClick={ () => append( {
                        language_id: '',
                        proficiency: '',
                        can_read: false,
                        can_write: false,
                        can_speak: false,
                    } ) }>
                        Add Language
                    </button>
                </div>
            </PopupModal>
        </>
    );
}
