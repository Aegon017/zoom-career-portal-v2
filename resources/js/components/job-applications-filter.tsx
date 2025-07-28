import { router } from '@inertiajs/react';
import { useEffect, useRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { SelectPopoverField } from './select-popover-field';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Form } from './ui/form';
import { X } from 'lucide-react';
import { Option } from '@/types';

interface JobOption {
    value: string;
    label: string;
}

interface FilterFormValues {
    status: string;
    job_id: string;
    skill: string;
}

interface JobApplicationsFilterProps {
    jobOptions: JobOption[];
    skills: string[];
    statuses: Option[];
    defaultValue?: number;
    selectedSkill?: string;
}

export const JobApplicationsFilter = ( {
    jobOptions,
    defaultValue,
    skills,
    statuses,
    selectedSkill,
}: JobApplicationsFilterProps ) => {
    const form = useForm<FilterFormValues>( {
        defaultValues: {
            status: '',
            job_id: defaultValue?.toString() ?? '',
            skill: selectedSkill ?? '',
        },
    } );

    const { control, watch, handleSubmit, reset } = form;
    const jobId = watch( 'job_id' );
    const skill = watch( 'skill' );
    const status = watch( 'status' );

    const hasMounted = useRef( false );
    const hasFilters = jobId || skill || status;

    const onSubmit = ( data: FilterFormValues ) => {
        router.get(
            '/employer/applications',
            {
                job_id: data.job_id || undefined,
                skill: data.skill || undefined,
                status: data.status || undefined,
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
                only: [ 'applications', 'skills', 'status' ],
            }
        );
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
    }, [ jobId, skill, status, handleSubmit ] );

    const clearFilters = () => {
        reset( { job_id: '', skill: '', status: '' } );
    };

    const skillOptions = useMemo(
        () => [ { value: '', label: 'All Skills' }, ...skills.map( ( s ) => ( { value: s, label: s } ) ) ],
        [ skills ]
    );

    const statusOptions = useMemo(
        () => [ { value: '', label: 'All Statuses' }, ...statuses.map( ( s ) => ( { value: s.value, label: s.label } ) ) ],
        [ statuses ]
    );

    return (
        <Card className="border-0 border-b-2 shadow-none rounded-none p-0">
            <CardContent className="p-0 pb-4">
                <Form { ...form }>
                    <form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col gap-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
                            <div className="sm:w-1/3">
                                <SelectPopoverField
                                    control={ control }
                                    name="job_id"
                                    options={ jobOptions }
                                    placeholder="Select job"
                                    label="Job"
                                />
                            </div>

                            { jobId && (
                                <>
                                    <div className="sm:w-1/3">
                                        <SelectPopoverField
                                            control={ control }
                                            name="skill"
                                            options={ skillOptions }
                                            placeholder="Select skill"
                                            label="Skill"
                                        />
                                    </div>

                                    <div className="sm:w-1/3">
                                        <SelectPopoverField
                                            control={ control }
                                            name="status"
                                            options={ statusOptions }
                                            placeholder="Select status"
                                            label="Status"
                                        />
                                    </div>
                                </>
                            ) }

                            { hasFilters && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={ clearFilters }
                                    className="text-muted-foreground hover:text-foreground mt-1 sm:mt-0"
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Clear
                                </Button>
                            ) }
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};
