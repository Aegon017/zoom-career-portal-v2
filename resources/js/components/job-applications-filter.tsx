import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { SelectPopoverField } from './select-popover-field';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Form } from './ui/form';
import { X } from 'lucide-react';
import { Skill } from '@/types';

interface JobOption {
    value: string;
    label: string;
}

interface FilterFormValues {
    job_id: string;
    skill: string;
}

interface JobApplicationsFilterProps {
    jobOptions: JobOption[];
    skills: Skill[];
    defaultValue?: number;
    selectedSkill?: string;
}

export const JobApplicationsFilter = ( {
    jobOptions,
    defaultValue,
    skills,
    selectedSkill
}: JobApplicationsFilterProps ) => {
    const form = useForm<FilterFormValues>( {
        defaultValues: {
            job_id: defaultValue?.toString() ?? '',
            skill: selectedSkill ?? '',
        },
    } );

    const { control, watch, handleSubmit, reset } = form;
    const jobId = watch( 'job_id' );
    const skill = watch( 'skill' );

    const hasMounted = useRef( false );
    const hasFilters = jobId || skill;

    const onSubmit = ( data: FilterFormValues ) => {
        router.get( '/employer/applications', {
            job_id: data.job_id || undefined,
            skill: data.skill || undefined,
        }, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: [ 'applications', 'skills' ],
        } );
    };

    useEffect( () => {
        if ( hasMounted.current ) {
            const timeoutId = setTimeout( () => {
                handleSubmit( onSubmit )();
            }, 300 );

            return () => clearTimeout( timeoutId );
        } else {
            hasMounted.current = true;
        }
    }, [ jobId, skill, handleSubmit ] );

    const clearFilters = () => {
        reset( {
            job_id: '',
            skill: '',
        } );
    };

    return (
        <Card className="rounded-none border-0 border-b-2 p-0 shadow-none">
            <CardContent className="space-y-4 p-0 pb-4">
                <Form { ...form }>
                    <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div className="sm:col-span-2">
                                <SelectPopoverField
                                    control={ control }
                                    name="job_id"
                                    options={ jobOptions }
                                    placeholder="Select job"
                                    label="Job"
                                />
                            </div>

                            { jobId && (
                                <div className="sm:col-span-1">
                                    <SelectPopoverField
                                        control={ control }
                                        name="skill"
                                        options={ [
                                            { value: '', label: 'All Skills' },
                                            ...skills.map( ( s ) => ( {
                                                value: s.name,
                                                label: s.name.charAt( 0 ).toUpperCase() + s.name.slice( 1 ),
                                            } ) ),
                                        ] }
                                        placeholder="Select skill"
                                        label="Skill"
                                    />
                                </div>
                            ) }

                            { hasFilters && (
                                <div className="flex items-end sm:col-span-1">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={ clearFilters }
                                        className="flex items-center gap-2"
                                    >
                                        <X className="h-4 w-4" />
                                        Clear
                                    </Button>
                                </div>
                            ) }
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};