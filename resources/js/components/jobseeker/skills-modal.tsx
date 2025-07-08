import React, { useEffect, useState } from "react";
import { Skill, User } from "@/types";
import PopupModal from "../popup-modal";
import { router } from "@inertiajs/react";
import { useForm, SubmitHandler } from "react-hook-form";
import Select from "react-select";
import axios from "axios";

interface SkillsModalProps {
    isActive: boolean;
    handleClose: () => void;
    user: User;
}

interface SkillsFormInputs {
    skills: string[];
}

const SkillsModal: React.FC<SkillsModalProps> = ( { isActive, handleClose, user } ) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<SkillsFormInputs>( {
        defaultValues: {
            skills: user.skills?.map( skill => skill.name ) || [],
        }
    } );

    const [ skillSearch, setSkillSearch ] = useState( "" );
    const [ skillOptions, setSkillOptions ] = useState<{ label: string; value: string }[]>( [] );

    const selectedSkills = watch( "skills" );

    useEffect( () => {
        const timeout = setTimeout( () => {
            axios.get( "/skills/search", { params: { search: skillSearch } } )
                .then( res => {
                    const formatted = res.data.map( ( s: any ) => ( {
                        label: s.label,
                        value: s.value
                    } ) );
                    setSkillOptions( formatted );
                } );
        }, 300 );

        return () => clearTimeout( timeout );
    }, [ skillSearch ] );

    const onSubmit: SubmitHandler<SkillsFormInputs> = ( data ) => {
        router.post( "/jobseeker/profile/skills", { ...data } );
        handleClose();
    };

    const defaultValues = user.skills?.map( skill => ( {
        label: skill.name,
        value: skill.name
    } ) ) || [];

    return (
        <PopupModal
            title="Key Skills"
            isActive={ isActive }
            onClose={ handleClose }
            onSave={ handleSubmit( onSubmit ) }
        >
            <div className="lightbox-content py-3">
                <div className="mb-3">
                    <label htmlFor="skills" className="form-label">Skills:</label>
                    <Select
                        isMulti
                        options={ skillOptions }
                        defaultValue={ defaultValues }
                        onChange={ ( selected ) => {
                            setValue( "skills", selected.map( ( s ) => s.value ) );
                        } }
                        onInputChange={ setSkillSearch }
                        placeholder="Type to search and add skills"
                        isClearable={ false }
                        classNamePrefix="react-select"
                    />
                    { errors.skills && <p className="text-danger">Skills are required</p> }
                </div>
            </div>
        </PopupModal>
    );
};

export default SkillsModal;
