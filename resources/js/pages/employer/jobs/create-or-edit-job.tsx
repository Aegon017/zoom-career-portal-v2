import DeleteAlert from '@/components/delete-alert';
import { SelectPopoverField } from '@/components/select-popover-field';
import QuillEditor from '@/components/text-editor';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/employer-layout';
import { Opening, Skill, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { MultiSelect } from '@/components/multi-select';
import axios from 'axios';
import { useStream } from '@laravel/stream-react';
import { toast } from 'sonner';

interface Props {
    job: Opening;
    operation: 'Create' | 'Edit';
    operationLabel: string;
    employementTypes: Array<{ value: string; label: string }>;
    workModel: Array<{ value: string; label: string }>;
    salaryUnits: Array<{ value: string; label: string }>;
    currencies: Array<{ value: string; label: string }>;
    jobStatuses: Array<{ value: string; label: string }>;
    skills: Skill[];
}

interface Location {
    value: string;
    label: string;
}

const CreateOrEditJob = ( {
    job,
    operation,
    operationLabel,
    employementTypes,
    workModel,
    salaryUnits,
    currencies,
    jobStatuses,
    skills,
}: Props ) => {
    const skillOptions = skills.map( skill => ( {
        label: skill.name,
        value: String( skill.id ),
    } ) );

    const [ countries, setCountries ] = useState<Location[]>( [] );
    const [ states, setStates ] = useState<Record<string, Location[]>>( {} );
    const [ cities, setCities ] = useState<Record<string, Location[]>>( {} );
    const [ alertOpen, setAlertOpen ] = useState( false );

    const { data: generatedDescription, isStreaming, send: generateDescription } = useStream( "/employer/ai/job-description" );

    useEffect( () => {
        if ( !isStreaming && !generatedDescription ) return;

        const prev = form.getValues( "description" ) ?? "";
        form.setValue( "description", generatedDescription );
    }, [ generatedDescription ] );

    const form = useForm<Opening>( {
        defaultValues: {
            ...job,
            skills: job?.skills ?? [],
        },
    } );

    const { handleSubmit, control, setError, setValue, watch } = form;

    const selectedCountry = watch( 'country' );
    const selectedState = watch( 'state' );

    const fetchCountries = async () => {
        try {
            const res = await axios.get( "/location/countries" );
            setCountries( res.data?.data || [] );
        } catch ( error ) {
            console.error( 'Error fetching countries:', error );
        }
    };

    const fetchStates = async ( countryName: string ) => {
        try {
            const res = await axios.post( "/location/states", { country: countryName } );
            setStates( prev => ( { ...prev, [ countryName ]: res.data?.data || [] } ) );
        } catch ( error ) {
            console.error( 'Error fetching states:', error );
        }
    };

    const fetchCities = async ( countryName: string, stateName: string ) => {
        try {
            const res = await axios.post( "/location/cities", { country: countryName, state: stateName } );
            setCities( prev => ( { ...prev, [ stateName ]: res.data?.data || [] } ) );
        } catch ( error ) {
            console.error( 'Error fetching cities:', error );
        }
    };

    useEffect( () => { fetchCountries(); }, [] );
    useEffect( () => { if ( selectedCountry ) fetchStates( selectedCountry ); }, [ selectedCountry ] );
    useEffect( () => { if ( selectedCountry && selectedState ) fetchCities( selectedCountry, selectedState ); }, [ selectedState ] );

    const onSubmit = ( data: any ) => {
        const handleErrors = ( errors: Record<string, string> ) => {
            Object.entries( errors ).forEach( ( [ field, message ] ) => {
                setError( field as keyof Opening, { type: 'server', message } );
            } );
        };

        const routes = {
            Create: () => router.post( "/employer/jobs", data, { onError: handleErrors } ),
            Edit: () => router.put( `/employer/jobs/${ job.id }`, data, { onError: handleErrors } ),
        };

        routes[ operation ]?.();
    };

    const handleDelete = ( id: number ) => router.delete( `/employer/jobs/${ id }` );

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Jobs', href: "/employer/jobs" },
        { title: operation, href: '' },
    ];

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title={ `${ operation } Job` } />
            <div className="flex flex-col gap-6 p-6">
                <Form { ...form }>
                    <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl font-semibold">{ operation } Job</h1>
                            { operation === 'Edit' && (
                                <>
                                    <Button variant="destructive" onClick={ ( e ) => { e.preventDefault(); setAlertOpen( true ); } }>Delete</Button>
                                    <DeleteAlert key={ job.id } alertOpen={ alertOpen } setAlertOpen={ setAlertOpen } onDelete={ () => handleDelete( job.id ) } />
                                </>
                            ) }
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Title, Skills, Description */ }
                            <FormField name="title" control={ control } rules={ { required: 'Job title is required' } } render={ ( { field } ) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Job Title</FormLabel>
                                    <FormControl><Input { ...field } /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) } />

                            <FormField name="skills" control={ control } render={ ( { field } ) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Required skills</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={ skillOptions }
                                            defaultValue={ field.value.map( ( v: any ) => String( v.id ) ) }
                                            value={ field.value.map( ( v: any ) => String( v.id ) ) }
                                            onValueChange={ ( values ) => field.onChange( values.map( id => ( { id: parseInt( id ) } ) ) ) }
                                            placeholder="Select skills required"
                                            variant="inverted"
                                            maxCount={ 3 }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) } />

                            <FormField name="description" control={ control } rules={ { required: 'Job description is required' } } render={ ( { field } ) => (
                                <FormItem className="col-span-2">
                                    <FormLabel>Job Description</FormLabel>
                                    <FormControl>
                                        <div className="space-y-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                disabled={ isStreaming }
                                                onClick={ () => {
                                                    const jobTitle = watch( 'title' );
                                                    const selectedSkills = watch( 'skills' ) || [];
                                                    if ( !jobTitle || selectedSkills.length === 0 ) {
                                                        toast.error( 'Please enter a job title and select skills.' );
                                                        return;
                                                    }
                                                    field.onChange( '' );
                                                    generateDescription( {
                                                        title: jobTitle,
                                                        skills: selectedSkills.map( ( s: any ) => s.name || s.id ),
                                                    } );
                                                } }
                                            >
                                                { isStreaming ? <span className="animate-pulse">Generating...</span> : 'Generate with AI' }
                                            </Button>
                                            <QuillEditor value={ field.value } onChange={ field.onChange } disabled={ isStreaming } />
                                            { isStreaming && <p className="text-sm text-muted-foreground italic">Streaming job description...</p> }
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ) } />

                            {/* Select Fields */ }
                            <SelectPopoverField control={ control } name="employment_type" label="Employment Type" options={ employementTypes } placeholder="Select employment type" rules={ { required: true } } />
                            <SelectPopoverField control={ control } name="work_model" label="Work Model" options={ workModel } placeholder="Select work model" rules={ { required: true } } />
                            <FormField name="salary_min" control={ control } render={ ( { field } ) => (
                                <FormItem><FormLabel>Min Salary</FormLabel><FormControl><Input type="number" { ...field } /></FormControl><FormMessage /></FormItem>
                            ) } />
                            <FormField name="salary_max" control={ control } render={ ( { field } ) => (
                                <FormItem><FormLabel>Max Salary</FormLabel><FormControl><Input type="number" { ...field } /></FormControl><FormMessage /></FormItem>
                            ) } />
                            <SelectPopoverField control={ control } name="salary_unit" label="Salary Unit" options={ salaryUnits } placeholder="Select unit" rules={ { required: true } } />
                            <SelectPopoverField control={ control } name="currency" label="Currency" options={ currencies } placeholder="Select currency" rules={ { required: true } } />
                            <SelectPopoverField control={ control } name="country" label="Country" options={ countries } placeholder="Select country" onChange={ () => { setValue( 'state', '' ); setValue( 'city', '' ); } } rules={ { required: true } } />
                            <SelectPopoverField control={ control } name="state" label="State" options={ states[ selectedCountry ?? '' ] || [] } placeholder="Select state" disabled={ !selectedCountry } onChange={ () => setValue( 'city', '' ) } rules={ { required: true } } />
                            <SelectPopoverField control={ control } name="city" label="City" options={ cities[ selectedState ?? '' ] || [] } placeholder="Select city" disabled={ !selectedState } rules={ { required: true } } />

                            <FormField name="expires_at" control={ control } rules={ { required: 'Please select expiry date' } } render={ ( { field } ) => (
                                <FormItem className="col-span-1">
                                    <FormLabel>Expiry Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant="outline" className={ cn( "w-full text-left", !field.value && "text-muted-foreground" ) }>{ field.value ? format( field.value, "PPP" ) : "Pick a date" }<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent align="start" className="w-auto p-0">
                                            <Calendar mode="single" selected={ field.value } onSelect={ field.onChange } disabled={ ( date: any ) => date < new Date() } />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            ) } />

                            <FormField name="apply_link" control={ control } render={ ( { field } ) => (
                                <FormItem><FormLabel>External Apply Link (optional)</FormLabel><FormControl><Input type="url" placeholder="https://example.com/apply" { ...field } /></FormControl><FormMessage /></FormItem>
                            ) } />
                            <SelectPopoverField control={ control } name="status" label="Status" options={ jobStatuses } placeholder="Select status" rules={ { required: true } } />
                        </div>

                        <div className="flex gap-4 justify-start">
                            <Button type="submit">{ operationLabel }</Button>
                            <Button type="button" variant="outline" onClick={ () => router.get( "/employer/jobs" ) }>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
};

export default CreateOrEditJob;