import { useState, useEffect } from 'react';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { router, Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PhoneInput } from '@/components/phone-input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Option } from '@/types';
import { Progress } from '@/components/ui/progress';
import { Stepper } from '@/components/ui/stepper';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import MultipleSelector from '@/components/multiple-selector';

// Step definitions
const steps = [
    { label: 'Personal', key: 'personal' },
    { label: 'Profile', key: 'profile' },
    { label: 'Skills', key: 'skills' },
    { label: 'Employment', key: 'employment' },
    { label: 'Education', key: 'education' },
    { label: 'Languages', key: 'languages' },
    { label: 'Review', key: 'review' },
];

// Form types
interface FormValues {
    name: string;
    email: string;
    phone: string;
    address: {
        location_id: string;
    };
    personal_detail: {
        gender: string;
        date_of_birth?: Date;
        marital_status?: string;
        differently_abled: boolean;
    };
    profile: {
        job_title?: string;
        experience?: string;
        notice_period?: string;
        summary?: string;
    };
    skills: string[];
    work_permits: string[];
    work_experiences: Array<{
        title: string;
        company_name: string;
        start_date: Date;
        end_date?: Date;
        is_current?: boolean;
    }>;
    educations: Array<{
        course_title: string;
        institution: string;
        start_date: Date;
        end_date?: Date;
        is_current?: boolean;
        course_type?: string;
    }>;
    user_languages: Array<{
        language_id: string;
        proficiency: string;
        can_read: boolean;
        can_write: boolean;
        can_speak: boolean;
    }>;
}

const JobseekerProfileWizard = ( {
    user,
    locations,
    skillOptions,
    languages
}: {
    user: any;
    locations: Option[];
    skillOptions: Option[];
    languages: Option[];
} ) => {
    const [ currentStep, setCurrentStep ] = useState( 0 );
    const [ locationOptions, setLocationOptions ] = useState<Option[]>( locations );

    // Field to step mapping for error navigation
    const fieldToStepMapping: Record<string, number> = {
        // Personal step (index 0)
        'name': 0,
        'email': 0,
        'phone': 0,
        'address.location_id': 0,
        'personal_detail.gender': 0,
        'personal_detail.date_of_birth': 0,
        'personal_detail.marital_status': 0,
        'personal_detail.differently_abled': 0,

        // Profile step (index 1)
        'profile.job_title': 1,
        'profile.experience': 1,
        'profile.notice_period': 1,
        'profile.summary': 1,

        // Skills step (index 2)
        'skills': 2,

        // Employment step (index 3)
        'work_permits': 3,
        'work_experiences': 3,

        // Education step (index 4)
        'educations': 4,

        // Languages step (index 5)
        'user_languages': 5,
    };

    const form = useForm<FormValues>( {
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: {
                location_id: user?.address?.location_id?.toString() || '',
            },
            personal_detail: {
                gender: user?.personal_detail?.gender || 'Male',
                date_of_birth: user?.personal_detail?.date_of_birth
                    ? new Date( user.personal_detail.date_of_birth )
                    : undefined,
                marital_status: user?.personal_detail?.marital_status || '',
                differently_abled: user?.personal_detail?.differently_abled || false,
            },
            profile: {
                job_title: user?.profile?.job_title || '',
                experience: user?.profile?.experience || '',
                notice_period: user?.profile?.notice_period || '',
                summary: user?.profile?.summary || '',
            },
            skills: user?.skills?.map( ( skill: any ) => skill.id.toString() ) || [],
            work_permits: user?.work_permits?.map( ( wp: any ) => wp.country ) || [],
            work_experiences: user?.work_experiences?.map( ( we: any ) => ( {
                company_name: we.company?.name || we.company_name || '',
                title: we.title || '',
                start_date: we.start_date ? new Date( we.start_date ) : new Date(),
                end_date: we.end_date ? new Date( we.end_date ) : undefined,
                is_current: we.is_current || false,
            } ) ) || [],
            educations: user?.educations?.map( ( edu: any ) => ( {
                course_title: edu.course_title || '',
                institution: edu.institution || '',
                start_date: edu.start_date ? new Date( edu.start_date ) : new Date(),
                end_date: edu.end_date ? new Date( edu.end_date ) : undefined,
                is_current: edu.is_current || false,
                course_type: edu.course_type || '',
            } ) ) || [],
            user_languages: user?.user_languages?.map( ( ul: any ) => ( {
                language_id: ul.language?.id?.toString() || '',
                proficiency: ul.proficiency || '',
                can_read: ul.can_read || false,
                can_write: ul.can_write || false,
                can_speak: ul.can_speak || false,
            } ) ) || [],
        }
    } );

    const { control, handleSubmit, formState, watch, setError } = form;

    // Field arrays
    const workExperienceFields = useFieldArray( {
        control,
        name: "work_experiences"
    } );

    const educationFields = useFieldArray( {
        control,
        name: "educations"
    } );

    const languageFields = useFieldArray( {
        control,
        name: "user_languages"
    } );

    // Helper function to check if a field has an error
    const hasFieldError = ( fieldName: string ) => {
        const fieldParts = fieldName.split( '.' );
        let errors = formState.errors as any;

        for ( const part of fieldParts ) {
            if ( errors && typeof errors === 'object' && part in errors ) {
                errors = errors[ part ];
            } else {
                return false;
            }
        }

        return !!errors;
    };

    // Scroll to first error field when step changes due to validation errors
    useEffect( () => {
        const timer = setTimeout( () => {
            const firstErrorField = document.querySelector( '[data-error="true"]' );
            if ( firstErrorField ) {
                firstErrorField.scrollIntoView( {
                    behavior: 'smooth',
                    block: 'center'
                } );
            }
        }, 100 );

        return () => clearTimeout( timer );
    }, [ currentStep ] );

    // Submit handler
    const onSubmit = ( data: FormValues ) => {
        const formattedData = {
            ...data,
            work_experiences: data.work_experiences?.map( we => ( {
                ...we,
                start_date: we.start_date.toISOString().split( 'T' )[ 0 ],
                end_date: we.end_date?.toISOString().split( 'T' )[ 0 ],
            } ) ),
            educations: data.educations?.map( edu => ( {
                ...edu,
                start_date: edu.start_date.toISOString().split( 'T' )[ 0 ],
                end_date: edu.end_date?.toISOString().split( 'T' )[ 0 ],
            } ) ),
            personal_detail: {
                ...data.personal_detail,
                date_of_birth: data.personal_detail.date_of_birth
                    ? data.personal_detail.date_of_birth.toISOString().split( 'T' )[ 0 ]
                    : undefined,
            }
        };

        const handleErrors = ( errors: any ) => {
            if ( errors && typeof errors === 'object' ) {
                let firstErrorStep = -1;

                Object.entries( errors ).forEach( ( [ field, message ] ) => {
                    setError( field as any, {
                        type: 'server',
                        message: message as string,
                    } );

                    // Find the step for this field
                    let stepIndex = fieldToStepMapping[ field ];

                    // Handle nested array errors (e.g., work_experiences.0.title)
                    if ( stepIndex === undefined ) {
                        const fieldParts = field.split( '.' );
                        if ( fieldParts.length >= 2 ) {
                            const baseField = fieldParts[ 0 ];
                            stepIndex = fieldToStepMapping[ baseField ];
                        }
                    }

                    if ( stepIndex !== undefined && firstErrorStep === -1 ) {
                        firstErrorStep = stepIndex;
                    }
                } );

                // Navigate to the first step with an error
                if ( firstErrorStep !== -1 ) {
                    setCurrentStep( firstErrorStep );
                }
            }
        };

        router.put( '/jobseeker/profile-complete', formattedData, {
            onError: handleErrors,
            onSuccess: () => {
                router.visit( '/dashboard' );
            }
        } );
    };

    // Navigation handlers
    const nextStep = () => setCurrentStep( prev => Math.min( prev + 1, steps.length - 1 ) );
    const prevStep = () => setCurrentStep( prev => Math.max( prev - 1, 0 ) );

    // Format date for display
    const formatDate = ( date: Date | undefined ) =>
        date ? format( date, 'PPP' ) : 'N/A';

    return (
        <>
            <Head title="Complete Your Profile" />
            <div className="container mx-auto py-8 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold">Complete Your Profile</h1>
                    <p className="text-muted-foreground">
                        Please complete all sections to access full platform features
                    </p>
                </div>

                <Stepper steps={ steps } currentStep={ currentStep } />
                <Progress
                    value={ ( currentStep + 1 ) / steps.length * 100 }
                    className="h-2 my-4"
                />

                <Form { ...form }>
                    <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-6">
                        {/* Personal Details Step */ }
                        { currentStep === 0 && (
                            <Card className="p-6">
                                <CardTitle>Personal Information</CardTitle>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <FormField
                                        control={ control }
                                        name="name"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        { ...field }
                                                        data-error={ hasFieldError( 'name' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="email"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        { ...field }
                                                        disabled
                                                        data-error={ hasFieldError( 'email' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="phone"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Phone</FormLabel>
                                                <FormControl>
                                                    <PhoneInput
                                                        { ...field }
                                                        data-error={ hasFieldError( 'phone' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="personal_detail.gender"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Gender</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={ field.onChange }
                                                        value={ field.value }
                                                    >
                                                        <SelectTrigger
                                                            data-error={ hasFieldError( 'personal_detail.gender' ) ? 'true' : 'false' }
                                                        >
                                                            <SelectValue placeholder="Select gender" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Male">Male</SelectItem>
                                                            <SelectItem value="Female">Female</SelectItem>
                                                            <SelectItem value="Other">Other</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="personal_detail.date_of_birth"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Date of Birth</FormLabel>
                                                <FormControl>
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className={ cn(
                                                                    "w-full text-left font-normal",
                                                                    !field.value && "text-muted-foreground"
                                                                ) }
                                                                data-error={ hasFieldError( 'personal_detail.date_of_birth' ) ? 'true' : 'false' }
                                                            >
                                                                { field.value ? (
                                                                    format( field.value, "PPP" )
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                ) }
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" align="start">
                                                            <Calendar
                                                                mode="single"
                                                                selected={ field.value }
                                                                onSelect={ field.onChange }
                                                                disabled={ ( date ) => date > new Date() }
                                                                initialFocus
                                                            />
                                                        </PopoverContent>
                                                    </Popover>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="personal_detail.marital_status"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Marital Status</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={ field.onChange }
                                                        value={ field.value }
                                                    >
                                                        <SelectTrigger
                                                            data-error={ hasFieldError( 'personal_detail.marital_status' ) ? 'true' : 'false' }
                                                        >
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Single">Single</SelectItem>
                                                            <SelectItem value="Married">Married</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="personal_detail.differently_abled"
                                        render={ ( { field } ) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={ field.value }
                                                        onCheckedChange={ field.onChange }
                                                        data-error={ hasFieldError( 'personal_detail.differently_abled' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormLabel>Differently Abled</FormLabel>
                                            </FormItem>
                                        ) }
                                    />
                                </div>
                            </Card>
                        ) }

                        {/* Profile Information Step */ }
                        { currentStep === 1 && (
                            <Card className="p-6">
                                <CardTitle>Career Profile</CardTitle>
                                <div className="grid md:grid-cols-2 gap-4 mt-4">
                                    <FormField
                                        control={ control }
                                        name="profile.job_title"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Desired Job Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        { ...field }
                                                        data-error={ hasFieldError( 'profile.job_title' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="profile.experience"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Years of Experience</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        { ...field }
                                                        data-error={ hasFieldError( 'profile.experience' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="profile.notice_period"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Notice Period (Days)</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        { ...field }
                                                        data-error={ hasFieldError( 'profile.notice_period' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                    <FormField
                                        control={ control }
                                        name="profile.summary"
                                        render={ ( { field } ) => (
                                            <FormItem className="md:col-span-2">
                                                <FormLabel>Professional Summary</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        { ...field }
                                                        rows={ 4 }
                                                        placeholder="Describe your professional background and career goals..."
                                                        data-error={ hasFieldError( 'profile.summary' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                </div>
                            </Card>
                        ) }

                        {/* Skills Step */ }
                        { currentStep === 2 && (
                            <Card className="p-6">
                                <CardTitle>Skills & Expertise</CardTitle>
                                <div className="mt-4">
                                    <FormField
                                        control={ control }
                                        name="skills"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Your Skills</FormLabel>
                                                <FormControl>
                                                    <MultipleSelector
                                                        options={ skillOptions }
                                                        value={ skillOptions.filter( opt =>
                                                            field.value.includes( opt.value )
                                                        ) }
                                                        onChange={ opts =>
                                                            field.onChange( opts.map( opt => opt.value ) )
                                                        }
                                                        placeholder="Select your skills..."
                                                        emptyIndicator={
                                                            <p className="text-center text-muted-foreground">
                                                                No skills found
                                                            </p>
                                                        }
                                                        data-error={ hasFieldError( 'skills' ) ? 'true' : 'false' }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                </div>
                            </Card>
                        ) }

                        {/* Employment Step */ }
                        { currentStep === 3 && (
                            <Card className="p-6">
                                <CardTitle>Work Experience</CardTitle>
                                <div className="space-y-4 mt-4">
                                    { workExperienceFields.fields.map( ( field, index ) => (
                                        <div key={ field.id } className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-medium">Experience #{ index + 1 }</h3>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={ () => workExperienceFields.remove( index ) }
                                                >
                                                    <Trash2 size={ 16 } />
                                                </Button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={ control }
                                                    name={ `work_experiences.${ index }.title` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Job Title</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    { ...field }
                                                                    data-error={ hasFieldError( `work_experiences.${ index }.title` ) ? 'true' : 'false' }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `work_experiences.${ index }.company_name` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Company</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    { ...field }
                                                                    data-error={ hasFieldError( `work_experiences.${ index }.company_name` ) ? 'true' : 'false' }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `work_experiences.${ index }.start_date` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Start Date</FormLabel>
                                                            <FormControl>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className={ cn(
                                                                                "w-full text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            ) }
                                                                            data-error={ hasFieldError( `work_experiences.${ index }.start_date` ) ? 'true' : 'false' }
                                                                        >
                                                                            { field.value ? (
                                                                                format( field.value, "PPP" )
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            ) }
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={ field.value }
                                                                            onSelect={ field.onChange }
                                                                            disabled={ ( date ) => date > new Date() }
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `work_experiences.${ index }.end_date` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>End Date</FormLabel>
                                                            <FormControl>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className={ cn(
                                                                                "w-full text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            ) }
                                                                            disabled={ watch( `work_experiences.${ index }.is_current` ) }
                                                                            data-error={ hasFieldError( `work_experiences.${ index }.end_date` ) ? 'true' : 'false' }
                                                                        >
                                                                            { field.value ? (
                                                                                format( field.value, "PPP" )
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            ) }
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={ field.value }
                                                                            onSelect={ field.onChange }
                                                                            disabled={ ( date ) => date > new Date() }
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `work_experiences.${ index }.is_current` }
                                                    render={ ( { field } ) => (
                                                        <FormItem className="flex items-center space-x-2">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={ field.value }
                                                                    onCheckedChange={ field.onChange }
                                                                    data-error={ hasFieldError( `work_experiences.${ index }.is_current` ) ? 'true' : 'false' }
                                                                />
                                                            </FormControl>
                                                            <FormLabel>I currently work here</FormLabel>
                                                        </FormItem>
                                                    ) }
                                                />
                                            </div>
                                        </div>
                                    ) ) }
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={ () => workExperienceFields.append( {
                                            title: '',
                                            company_name: '',
                                            start_date: new Date(),
                                            is_current: false
                                        } ) }
                                    >
                                        <Plus size={ 16 } className="mr-2" />
                                        Add Experience
                                    </Button>
                                </div>
                            </Card>
                        ) }

                        {/* Education Step */ }
                        { currentStep === 4 && (
                            <Card className="p-6">
                                <CardTitle>Education</CardTitle>
                                <div className="space-y-4 mt-4">
                                    { educationFields.fields.map( ( field, index ) => (
                                        <div key={ field.id } className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-medium">Education #{ index + 1 }</h3>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={ () => educationFields.remove( index ) }
                                                >
                                                    <Trash2 size={ 16 } />
                                                </Button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={ control }
                                                    name={ `educations.${ index }.course_title` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Course/Degree</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    { ...field }
                                                                    data-error={ hasFieldError( `educations.${ index }.course_title` ) ? 'true' : 'false' }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `educations.${ index }.institution` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Institution</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    { ...field }
                                                                    data-error={ hasFieldError( `educations.${ index }.institution` ) ? 'true' : 'false' }
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `educations.${ index }.start_date` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Start Date</FormLabel>
                                                            <FormControl>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className={ cn(
                                                                                "w-full text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            ) }
                                                                            data-error={ hasFieldError( `educations.${ index }.start_date` ) ? 'true' : 'false' }
                                                                        >
                                                                            { field.value ? (
                                                                                format( field.value, "PPP" )
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            ) }
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={ field.value }
                                                                            onSelect={ field.onChange }
                                                                            disabled={ ( date ) => date > new Date() }
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `educations.${ index }.end_date` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>End Date</FormLabel>
                                                            <FormControl>
                                                                <Popover>
                                                                    <PopoverTrigger asChild>
                                                                        <Button
                                                                            variant="outline"
                                                                            className={ cn(
                                                                                "w-full text-left font-normal",
                                                                                !field.value && "text-muted-foreground"
                                                                            ) }
                                                                            disabled={ watch( `educations.${ index }.is_current` ) }
                                                                            data-error={ hasFieldError( `educations.${ index }.end_date` ) ? 'true' : 'false' }
                                                                        >
                                                                            { field.value ? (
                                                                                format( field.value, "PPP" )
                                                                            ) : (
                                                                                <span>Pick a date</span>
                                                                            ) }
                                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                        </Button>
                                                                    </PopoverTrigger>
                                                                    <PopoverContent className="w-auto p-0" align="start">
                                                                        <Calendar
                                                                            mode="single"
                                                                            selected={ field.value }
                                                                            onSelect={ field.onChange }
                                                                            disabled={ ( date ) => date > new Date() }
                                                                            initialFocus
                                                                        />
                                                                    </PopoverContent>
                                                                </Popover>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `educations.${ index }.is_current` }
                                                    render={ ( { field } ) => (
                                                        <FormItem className="flex items-center space-x-2">
                                                            <FormControl>
                                                                <Checkbox
                                                                    checked={ field.value }
                                                                    onCheckedChange={ field.onChange }
                                                                    data-error={ hasFieldError( `educations.${ index }.is_current` ) ? 'true' : 'false' }
                                                                />
                                                            </FormControl>
                                                            <FormLabel>Currently studying</FormLabel>
                                                        </FormItem>
                                                    ) }
                                                />
                                            </div>
                                        </div>
                                    ) ) }
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={ () => educationFields.append( {
                                            course_title: '',
                                            institution: '',
                                            start_date: new Date(),
                                            is_current: false
                                        } ) }
                                    >
                                        <Plus size={ 16 } className="mr-2" />
                                        Add Education
                                    </Button>
                                </div>
                            </Card>
                        ) }

                        {/* Languages Step */ }
                        { currentStep === 5 && (
                            <Card className="p-6">
                                <CardTitle>Languages</CardTitle>
                                <div className="space-y-4 mt-4">
                                    { languageFields.fields.map( ( field, index ) => (
                                        <div key={ field.id } className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-medium">Language #{ index + 1 }</h3>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={ () => languageFields.remove( index ) }
                                                >
                                                    <Trash2 size={ 16 } />
                                                </Button>
                                            </div>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={ control }
                                                    name={ `user_languages.${ index }.language_id` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Language</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={ field.onChange }
                                                                    value={ field.value }
                                                                >
                                                                    <SelectTrigger
                                                                        data-error={ hasFieldError( `user_languages.${ index }.language_id` ) ? 'true' : 'false' }
                                                                    >
                                                                        <SelectValue placeholder="Select language" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        { languages.map( lang => (
                                                                            <SelectItem
                                                                                key={ lang.value }
                                                                                value={ lang.value }
                                                                            >
                                                                                { lang.label }
                                                                            </SelectItem>
                                                                        ) ) }
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <FormField
                                                    control={ control }
                                                    name={ `user_languages.${ index }.proficiency` }
                                                    render={ ( { field } ) => (
                                                        <FormItem>
                                                            <FormLabel>Proficiency</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={ field.onChange }
                                                                    value={ field.value }
                                                                >
                                                                    <SelectTrigger
                                                                        data-error={ hasFieldError( `user_languages.${ index }.proficiency` ) ? 'true' : 'false' }
                                                                    >
                                                                        <SelectValue placeholder="Select proficiency" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="beginner">Beginner</SelectItem>
                                                                        <SelectItem value="intermediate">Intermediate</SelectItem>
                                                                        <SelectItem value="advanced">Advanced</SelectItem>
                                                                        <SelectItem value="fluent">Fluent</SelectItem>
                                                                        <SelectItem value="native">Native</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    ) }
                                                />
                                                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                                                    <FormField
                                                        control={ control }
                                                        name={ `user_languages.${ index }.can_read` }
                                                        render={ ( { field } ) => (
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={ field.value }
                                                                        onCheckedChange={ field.onChange }
                                                                        data-error={ hasFieldError( `user_languages.${ index }.can_read` ) ? 'true' : 'false' }
                                                                    />
                                                                </FormControl>
                                                                <FormLabel>Can Read</FormLabel>
                                                            </FormItem>
                                                        ) }
                                                    />
                                                    <FormField
                                                        control={ control }
                                                        name={ `user_languages.${ index }.can_write` }
                                                        render={ ( { field } ) => (
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={ field.value }
                                                                        onCheckedChange={ field.onChange }
                                                                        data-error={ hasFieldError( `user_languages.${ index }.can_write` ) ? 'true' : 'false' }
                                                                    />
                                                                </FormControl>
                                                                <FormLabel>Can Write</FormLabel>
                                                            </FormItem>
                                                        ) }
                                                    />
                                                    <FormField
                                                        control={ control }
                                                        name={ `user_languages.${ index }.can_speak` }
                                                        render={ ( { field } ) => (
                                                            <FormItem className="flex items-center space-x-2">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={ field.value }
                                                                        onCheckedChange={ field.onChange }
                                                                        data-error={ hasFieldError( `user_languages.${ index }.can_speak` ) ? 'true' : 'false' }
                                                                    />
                                                                </FormControl>
                                                                <FormLabel>Can Speak</FormLabel>
                                                            </FormItem>
                                                        ) }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ) ) }
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={ () => languageFields.append( {
                                            language_id: '',
                                            proficiency: 'beginner',
                                            can_read: false,
                                            can_write: false,
                                            can_speak: false
                                        } ) }
                                    >
                                        <Plus size={ 16 } className="mr-2" />
                                        Add Language
                                    </Button>
                                </div>
                            </Card>
                        ) }

                        {/* Review Step */ }
                        { currentStep === 6 && (
                            <Card className="p-6">
                                <CardTitle>Review Your Profile</CardTitle>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    <div>
                                        <h3 className="font-bold mb-2">Personal Information</h3>
                                        <p><strong>Name:</strong> { watch( 'name' ) }</p>
                                        <p><strong>Email:</strong> { watch( 'email' ) }</p>
                                        <p><strong>Phone:</strong> { watch( 'phone' ) }</p>
                                        <p><strong>Gender:</strong> { watch( 'personal_detail.gender' ) }</p>
                                        <p><strong>Date of Birth:</strong> { formatDate( watch( 'personal_detail.date_of_birth' ) ) }</p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold mb-2">Career Profile</h3>
                                        <p><strong>Job Title:</strong> { watch( 'profile.job_title' ) }</p>
                                        <p><strong>Experience:</strong> { watch( 'profile.experience' ) } years</p>
                                        <p><strong>Notice Period:</strong> { watch( 'profile.notice_period' ) } days</p>
                                        <p><strong>Summary:</strong> { watch( 'profile.summary' ) }</p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold mb-2">Skills</h3>
                                        <ul className="list-disc pl-5">
                                            { watch( 'skills' )?.map( skillId => {
                                                const skill = skillOptions.find( s => s.value === skillId );
                                                return skill ? <li key={ skillId }>{ skill.label }</li> : null;
                                            } ) }
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="font-bold mb-2">Work Experience</h3>
                                        { watch( 'work_experiences' )?.map( ( exp, idx ) => (
                                            <div key={ idx } className="mb-3">
                                                <p><strong>{ exp.title }</strong> at { exp.company_name }</p>
                                                <p>Start: { formatDate( exp.start_date ) }</p>
                                                <p>End: { exp.is_current ? 'Present' : formatDate( exp.end_date ) }</p>
                                            </div>
                                        ) ) }
                                    </div>

                                    <div>
                                        <h3 className="font-bold mb-2">Education</h3>
                                        { watch( 'educations' )?.map( ( edu, idx ) => (
                                            <div key={ idx } className="mb-3">
                                                <p><strong>{ edu.course_title }</strong> at { edu.institution }</p>
                                                <p>Start: { formatDate( edu.start_date ) }</p>
                                                <p>End: { edu.is_current ? 'Present' : formatDate( edu.end_date ) }</p>
                                            </div>
                                        ) ) }
                                    </div>

                                    <div>
                                        <h3 className="font-bold mb-2">Languages</h3>
                                        { watch( 'user_languages' )?.map( ( lang, idx ) => {
                                            const language = languages.find( l => l.value === lang.language_id );
                                            return (
                                                <div key={ idx } className="mb-2">
                                                    <p><strong>{ language?.label }</strong> - { lang.proficiency }</p>
                                                    <p className="text-sm">
                                                        { lang.can_read ? 'Read' : '' }
                                                        { lang.can_write ? ', Write' : '' }
                                                        { lang.can_speak ? ', Speak' : '' }
                                                    </p>
                                                </div>
                                            );
                                        } ) }
                                    </div>
                                </div>
                            </Card>
                        ) }

                        {/* Navigation Buttons */ }
                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={ prevStep }
                                disabled={ currentStep === 0 }
                            >
                                Back
                            </Button>

                            { currentStep < steps.length - 1 ? (
                                <Button type="button" onClick={ nextStep }>
                                    Next
                                </Button>
                            ) : (
                                <Button type="submit" disabled={ formState.isSubmitting }>
                                    { formState.isSubmitting ? 'Saving...' : 'Complete Profile' }
                                </Button>
                            ) }
                        </div>
                    </form>
                </Form>
            </div>
        </>
    );
};

export default JobseekerProfileWizard;