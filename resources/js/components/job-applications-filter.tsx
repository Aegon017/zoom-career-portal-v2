import { useForm } from "react-hook-form";
import { SelectPopoverField } from "./select-popover-field";
import { Card, CardContent } from "./ui/card";
import { Form } from "./ui/form";
import { router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { Button } from "./ui/button";

interface Props {
    jobOptions: { value: string; label: string }[];
    skills: string[];
    defaultValue?: number;
    selectedSkill?: string;
}

const JobApplicationsFilter = ( { jobOptions, defaultValue, skills, selectedSkill }: Props ) => {
    const form = useForm( {
        defaultValues: {
            job_id: defaultValue ?? "",
            skill: selectedSkill ?? "all",
        },
    } );

    const { control, watch, handleSubmit } = form;
    const jobId = watch( "job_id" );
    const skill = watch( "skill" );

    const hasMounted = useRef( false );

    const onSubmit = ( data: any ) => {
        router.get( "/employer/applications", data, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
            only: [ "applications", "skills" ],
        } );
    };

    useEffect( () => {
        if ( hasMounted.current ) {
            handleSubmit( onSubmit )();
        } else {
            hasMounted.current = true;
        }
    }, [ jobId, skill ] );

    return (
        <Card className="p-0 shadow-none border-0 border-b-2 rounded-none">
            <CardContent className="p-0 pb-4 space-y-4">
                <Form { ...form }>
                    <form onSubmit={ handleSubmit( onSubmit ) }>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-2">
                                <SelectPopoverField
                                    control={ control }
                                    name="job_id"
                                    options={ jobOptions }
                                    placeholder="Filter by job"
                                    label=""
                                />
                            </div>
                            { jobId && (
                                <div className="col-span-1">
                                    <SelectPopoverField
                                        control={ control }
                                        name="skill"
                                        options={ [
                                            ...skills.map( ( s ) => ( {
                                                value: s,
                                                label: s.charAt( 0 ).toUpperCase() + s.slice( 1 ),
                                            } ) ),
                                        ] }
                                        placeholder="Filter by skill"
                                        label=""
                                    />
                                </div>
                            ) }
                            <div className="flex items-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={ () => {
                                        form.reset( {
                                            skill: "",
                                        } );
                                    } }
                                >
                                    Clear Filters
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default JobApplicationsFilter;
