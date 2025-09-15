import DeleteAlert from "@/components/delete-alert";
import MultipleSelector from "@/components/multiple-selector";
import { PhoneInput } from "@/components/phone-input";
import { SelectPopoverField } from "@/components/select-popover-field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import AppLayout from "@/layouts/app-layout";
import { cn } from "@/lib/utils";
import { Option, User, type BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Stepper } from "@/components/ui/stepper";

interface Props {
	student: User;
	operation: string;
	operationLabel: string;
	locations: Option[];
	skillOptions: Option[];
	languages: Option[];
}

interface FormValues {
	name: string;
	email: string;
	phone: string;
	password?: string;
	avatar_url?: string;
	address: { location_id: string };
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
		company_id?: string;
		company_name?: string;
		title: string;
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
	certificates: Array<{ name: string }>;
	user_languages: Array<{
		language_id: string;
		proficiency: string;
		can_read: boolean;
		can_write: boolean;
		can_speak: boolean;
	}>;
	domain_id: Option[];
}

const CreateOrEditStudent = ( { student, locations, operation, operationLabel, skillOptions, languages }: Props ) => {
	const [ countryOptions, setCountryOptions ] = useState<Option[]>( [] );
	const [ locationOptions, setLocationOptions ] = useState<Option[]>( locations );
	const [ locationSearch, setLocationSearch ] = useState( "" );
	const [ alertOpen, setAlertOpen ] = useState( false );
	const [ currentStep, setCurrentStep ] = useState( 0 );

	const breadcrumbs: BreadcrumbItem[] = [
		{ title: "Students", href: "/admin/students" },
		{ title: operation, href: "" },
	];

	const form = useForm<FormValues>( {
		defaultValues: {
			name: student?.name || "",
			email: student?.email || "",
			phone: student?.phone || "",
			password: "",
			avatar_url: student?.avatar_url || "",
			address: { location_id: student?.address?.location_id?.toString() || "" },
			personal_detail: {
				gender: student?.personal_detail?.gender || "Male",
				date_of_birth: student?.personal_detail?.date_of_birth ? new Date( student.personal_detail.date_of_birth ) : undefined,
				marital_status: student?.personal_detail?.marital_status || "",
				differently_abled: student?.personal_detail?.differently_abled || false,
			},
			profile: {
				job_title: student?.profile?.job_title || "",
				experience: student?.profile?.experience || "",
				notice_period: student?.profile?.notice_period || "",
				summary: student?.profile?.summary || "",
			},
			skills: student?.skills?.map( ( skill ) => skill.id.toString() ) || [],
			work_permits: student?.work_permits?.map( ( wp ) => wp.country ) || [],
			work_experiences: student?.work_experiences?.map( ( we ) => ( {
				company_id: we.company_id?.toString() || "",
				company_name: we.company?.name || we.company_name || "",
				title: we.title || "",
				start_date: we.start_date ? new Date( we.start_date ) : new Date(),
				end_date: we.end_date ? new Date( we.end_date ) : undefined,
				is_current: we.is_current || false,
			} ) ) || [],
			educations: student?.educations?.map( ( edu ) => ( {
				course_title: edu.course_title || "",
				institution: edu.institution || "",
				start_date: edu.start_date ? new Date( edu.start_date ) : new Date(),
				end_date: edu.end_date ? new Date( edu.end_date ) : undefined,
				is_current: edu.is_current || false,
				course_type: edu.course_type || "",
			} ) ) || [],
			certificates: student?.certificates?.map( ( cert ) => ( { name: cert.name || "" } ) ) || [],
			user_languages: student?.user_languages?.map( ( ul ) => ( {
				language_id: ul.language?.id?.toString() || "",
				proficiency: ul.proficiency || "",
				can_read: ul.can_read || false,
				can_write: ul.can_write || false,
				can_speak: ul.can_speak || false,
			} ) ) || [],
			domain_id: [],
		},
	} );

	const { control, handleSubmit, setError, watch, setValue, formState } = form;
	const { errors } = formState;

	const workExperienceFields = useFieldArray( { control, name: "work_experiences" } );
	const educationFields = useFieldArray( { control, name: "educations" } );
	const certificateFields = useFieldArray( { control, name: "certificates" } );
	const languageFields = useFieldArray( { control, name: "user_languages" } );

	const fetchOptions = useCallback( async ( endpoint: string, search: string ) => {
		try {
			const { data } = await axios.get( endpoint, { params: { search } } );
			return data;
		} catch ( error ) {
			console.error( `Error fetching ${ endpoint }:`, error );
			return [];
		}
	}, [] );

	useEffect( () => {
		axios.get( "/location/countries" ).then( ( res ) => {
			if ( res.data.success && Array.isArray( res.data.data ) ) {
				setCountryOptions( res.data.data.map( ( c: any ) => ( { label: c.label || c.country || "", value: c.value?.toString() || c.country || "" } ) ) );
			}
		} );
	}, [] );

	useEffect( () => {
		const timeout = setTimeout( async () => {
			if ( locationSearch.trim() ) {
				const data = await fetchOptions( "/locations/search", locationSearch );
				setLocationOptions( data );
			} else {
				setLocationOptions( locations );
			}
		}, 300 );
		return () => clearTimeout( timeout );
	}, [ locationSearch, locations, fetchOptions ] );

	const onSubmit = ( data: FormValues ) => {
		const fieldToTabMapping: Record<string, number> = {
			name: 0, email: 0, phone: 0, password: 0, avatar_url: 0,
			"address.location_id": 1, "personal_detail.gender": 1, "personal_detail.date_of_birth": 1, "personal_detail.marital_status": 1, "personal_detail.differently_abled": 1,
			"profile.job_title": 2, "profile.experience": 2, "profile.notice_period": 2, "profile.summary": 2,
			skills: 3, work_permits: 4, work_experiences: 4, educations: 5, certificates: 6, user_languages: 7
		};

		const handleErrors = ( errors: any ) => {
			if ( errors && typeof errors === "object" ) {
				let firstErrorTab = -1;
				Object.entries( errors ).forEach( ( [ field, message ] ) => {
					setError( field as any, { type: "server", message: message as string } );
					const tabIndex = fieldToTabMapping[ field ] ?? fieldToTabMapping[ field.split( '.' )[ 0 ] ];
					if ( tabIndex !== undefined && firstErrorTab === -1 ) firstErrorTab = tabIndex;
				} );
				if ( firstErrorTab !== -1 ) setCurrentStep( firstErrorTab );
			}
		};

		const formattedData = {
			...data,
			work_experiences: data.work_experiences?.map( we => ( {
				...we,
				start_date: we.start_date?.toISOString().split( "T" )[ 0 ],
				end_date: we.end_date?.toISOString().split( "T" )[ 0 ]
			} ) ),
			educations: data.educations?.map( edu => ( {
				...edu,
				start_date: edu.start_date?.toISOString().split( "T" )[ 0 ],
				end_date: edu.end_date?.toISOString().split( "T" )[ 0 ]
			} ) ),
			personal_detail: {
				...data.personal_detail,
				date_of_birth: data.personal_detail.date_of_birth?.toISOString().split( "T" )[ 0 ]
			}
		};

		const routes = {
			Create: () => router.post( "/admin/students", formattedData, { onError: handleErrors } ),
			Edit: () => router.put( `/admin/students/${ student.id }`, formattedData, { onError: handleErrors } )
		};
		routes[ operation as keyof typeof routes ]?.();
	};

	const handleDelete = () => router.delete( `/admin/students/${ student.id }` );

	const steps = [
		{ label: "Account", key: "account" }, { label: "Personal", key: "personal" }, { label: "Profile", key: "profile" },
		{ label: "Skills", key: "skills" }, { label: "Employment", key: "employment" }, { label: "Education", key: "education" },
		{ label: "Certifications", key: "certifications" }, { label: "Languages", key: "languages" }, { label: "Review", key: "review" }
	];

	const hasFieldError = ( fieldName: string ) => {
		const fieldParts = fieldName.split( '.' );
		let errorObj: any = errors;
		for ( const part of fieldParts ) {
			if ( errorObj && typeof errorObj === 'object' && part in errorObj ) errorObj = errorObj[ part ];
			else return false;
		}
		return !!errorObj;
	};

	useEffect( () => {
		const timer = setTimeout( () => {
			const firstErrorField = document.querySelector( '[data-error="true"]' );
			firstErrorField?.scrollIntoView( { behavior: "smooth", block: "center" } );
		}, 100 );
		return () => clearTimeout( timer );
	}, [ currentStep ] );

	const formatDateSafely = ( date: Date | string | undefined ) => {
		if ( !date ) return "N/A";
		try {
			const dateObj = date instanceof Date ? date : new Date( date );
			return isNaN( dateObj.getTime() ) ? "N/A" : format( dateObj, "PPP" );
		} catch {
			return "N/A";
		}
	};

	const selectedDomain = watch( "domain_id" );

	useEffect( () => {
		if ( selectedDomain?.length > 0 ) {
			const domainId = selectedDomain[ 0 ].value;
			axios.get( `/admin/domains/${ domainId }/skills` ).then( ( { data } ) => {
				const domainSkills = data.map( ( skill: any ) => ( {
					value: String( skill.id ),
					label: skill.name
				} ) );
				setValue( "skills", prev => {
					// Ensure prev is always an array
					const currentSkills = Array.isArray( prev ) ? prev : [];
					const existingSkills = new Set( currentSkills );
					const newSkills = domainSkills
						.filter( ( s: Option ) => !existingSkills.has( s.value ) )
						.map( ( s: Option ) => s.value );
					return [ ...currentSkills, ...newSkills ];
				} );
			} ).catch( console.error );
		}
	}, [ selectedDomain, setValue ] );

	const searchDomains = async ( searchTerm: string ) => {
		try {
			const response = await axios.get( "/admin/domains/search", { params: { search: searchTerm } } );
			return response.data.map( ( domain: any ) => ( { value: String( domain.id ), label: domain.name } ) );
		} catch ( error ) {
			console.error( "Error searching domains:", error );
			return [];
		}
	};

	return (
		<AppLayout breadcrumbs={ breadcrumbs }>
			<Head title={ `${ operation } student` } />
			<div className="flex flex-1 flex-col gap-6 rounded-xl p-2 sm:p-6 w-full max-w-3xl mx-auto">
				<Form { ...form }>
					<form onSubmit={ handleSubmit( onSubmit ) } className="w-full">
						<Stepper steps={ steps } currentStep={ currentStep } />
						<div className="w-full px-1 sm:px-0 mb-4">
							<Progress value={ ( ( currentStep + 1 ) / steps.length ) * 100 } className="h-2 sm:h-2.5 rounded-full" />
						</div>
						<Tabs value={ steps[ currentStep ].key } className="w-full">
							<TabsContent value="account" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Account Details</CardTitle>
									<Separator />
									<div className="space-y-6">
										<div className="grid gap-4 md:grid-cols-2">
											<FormField control={ control } name="name" render={ ( { field } ) => (
												<FormItem><FormLabel>Full name</FormLabel><FormControl><Input type="text" { ...field } autoComplete="name" data-error={ hasFieldError( "name" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
											) } />
											<FormField control={ control } name="email" render={ ( { field } ) => (
												<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" { ...field } autoComplete="email" data-error={ hasFieldError( "email" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
											) } />
											<FormField control={ control } name="phone" render={ ( { field } ) => (
												<FormItem><FormLabel>Phone</FormLabel><FormControl><PhoneInput type="tel" { ...field } data-error={ hasFieldError( "phone" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
											) } />
											<FormField control={ control } name="password" render={ ( { field } ) => (
												<FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" { ...field } data-error={ hasFieldError( "password" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
											) } />
										</div>
									</div>
								</Card>
								<div className="flex justify-between mt-4"><span /><Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button></div>
							</TabsContent>

							<TabsContent value="personal" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Personal Details</CardTitle>
									<Separator />
									<div className="grid md:grid-cols-2 gap-4">
										<FormField control={ control } name="personal_detail.gender" render={ ( { field } ) => (
											<FormItem><FormLabel>Gender</FormLabel><FormControl><Select onValueChange={ field.onChange } value={ field.value }><SelectTrigger data-error={ hasFieldError( "personal_detail.gender" ) ? "true" : "false" }><SelectValue placeholder="Select gender" /></SelectTrigger><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select></FormControl><FormMessage /></FormItem>
										) } />
										<FormField control={ control } name="personal_detail.marital_status" render={ ( { field } ) => (
											<FormItem><FormLabel>Marital Status</FormLabel><FormControl><Select onValueChange={ field.onChange } value={ field.value }><SelectTrigger data-error={ hasFieldError( "personal_detail.marital_status" ) ? "true" : "false" }><SelectValue placeholder="Select marital status" /></SelectTrigger><SelectContent><SelectItem value="Single/unmarried">Single/unmarried</SelectItem><SelectItem value="Married">Married</SelectItem></SelectContent></Select></FormControl><FormMessage /></FormItem>
										) } />
										<FormField control={ control } name="personal_detail.date_of_birth" render={ ( { field } ) => (
											<FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={ cn( "w-full text-left", !field.value && "text-muted-foreground" ) } data-error={ hasFieldError( "personal_detail.date_of_birth" ) ? "true" : "false" }>{ field.value ? format( field.value, "PPP" ) : "Pick a date" }<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent align="start" className="w-auto p-0"><Calendar mode="single" selected={ field.value ?? undefined } onSelect={ field.onChange } disabled={ date => date > new Date() } captionLayout="dropdown" /></PopoverContent></Popover></FormControl><FormMessage /></FormItem>
										) } />
										<FormField control={ control } name="personal_detail.differently_abled" render={ ( { field } ) => (
											<FormItem className="flex flex-row items-center gap-2"><FormControl><Checkbox checked={ field.value } onCheckedChange={ field.onChange } data-error={ hasFieldError( "personal_detail.differently_abled" ) ? "true" : "false" } /></FormControl><FormLabel className="text-sm font-normal">Are You Differently Abled</FormLabel></FormItem>
										) } />
										<SelectPopoverField options={ locationOptions } name="address.location_id" control={ control } label="Address" placeholder="Select Address" onValueChange={ setLocationSearch } data-error={ hasFieldError( "address.location_id" ) ? "true" : "false" } />
									</div>
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button>
								</div>
							</TabsContent>

							<TabsContent value="profile" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Profile</CardTitle>
									<Separator />
									<div className="grid md:grid-cols-2 gap-4">
										<FormField control={ control } name="profile.experience" render={ ( { field } ) => (
											<FormItem><FormLabel>Experience</FormLabel><FormControl><Input type="text" { ...field } data-error={ hasFieldError( "profile.experience" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
										) } />
										<FormField control={ control } name="profile.notice_period" render={ ( { field } ) => (
											<FormItem><FormLabel>Notice Period</FormLabel><FormControl><Input type="text" { ...field } data-error={ hasFieldError( "profile.notice_period" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
										) } />
										<FormField control={ control } name="profile.job_title" render={ ( { field } ) => (
											<FormItem><FormLabel>Job Title</FormLabel><FormControl><Input type="text" { ...field } data-error={ hasFieldError( "profile.job_title" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
										) } />
										<FormField control={ control } name="profile.summary" render={ ( { field } ) => (
											<FormItem className="md:col-span-2"><FormLabel>Summary</FormLabel><FormControl><Textarea { ...field } data-error={ hasFieldError( "profile.summary" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
										) } />
									</div>
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button>
								</div>
							</TabsContent>

							<TabsContent value="skills" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Skills</CardTitle>
									<Separator />
									<FormField name="domain_id" control={ control } render={ ( { field } ) => (
										<FormItem><FormLabel>Select Domain</FormLabel><FormControl><MultipleSelector value={ field.value } onChange={ field.onChange } onSearch={ searchDomains } maxSelected={ 1 } triggerSearchOnFocus placeholder="Search domain..." loadingIndicator={ <p className="text-muted-foreground py-2 text-center">Searching domains...</p> } emptyIndicator={ <p className="text-muted-foreground w-full text-center">No domains found</p> } /></FormControl><FormMessage /></FormItem>
									) } />
									<FormField control={ control } name="skills" render={ ( { field } ) => (
										<FormItem><FormLabel>Skills</FormLabel><FormControl><MultipleSelector options={ skillOptions } value={ skillOptions.filter( opt => field.value.includes( opt.value ) ) } onChange={ opts => field.onChange( opts.map( opt => opt.value ) ) } triggerSearchOnFocus placeholder="Search skill..." loadingIndicator={ <p className="text-muted-foreground py-2 text-center">Searching skills...</p> } emptyIndicator={ <p className="text-muted-foreground w-full text-center">No skills found</p> } data-error={ hasFieldError( "skills" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
									) } />
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button>
								</div>
							</TabsContent>

							<TabsContent value="employment" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Employment</CardTitle>
									<Separator />
									<FormField control={ control } name="work_permits" render={ ( { field } ) => (
										<FormItem className="mb-4"><FormLabel>Work Permits</FormLabel><FormControl><MultipleSelector options={ countryOptions } value={ countryOptions.filter( opt => field.value.includes( opt.value ) ) } onChange={ opts => field.onChange( opts.map( opt => opt.value ) ) } placeholder="Select countries where you have work permit" emptyIndicator="No countries found" data-error={ hasFieldError( "work_permits" ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
									) } />
									<div className="space-y-4 mt-4">
										{ workExperienceFields.fields.map( ( field, index ) => (
											<div key={ field.id } className="border rounded-lg p-4">
												<div className="flex justify-between items-center mb-4">
													<h3 className="font-medium">Experience #{ index + 1 }</h3>
													<Button type="button" variant="ghost" size="icon" onClick={ () => workExperienceFields.remove( index ) }><Trash2 size={ 16 } /></Button>
												</div>
												<div className="grid md:grid-cols-2 gap-4">
													<FormField control={ control } name={ `work_experiences.${ index }.title` } render={ ( { field } ) => (
														<FormItem><FormLabel>Job Title</FormLabel><FormControl><Input { ...field } data-error={ hasFieldError( `work_experiences.${ index }.title` ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `work_experiences.${ index }.company_name` } render={ ( { field } ) => (
														<FormItem><FormLabel>Company</FormLabel><FormControl><Input { ...field } data-error={ hasFieldError( `work_experiences.${ index }.company_name` ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `work_experiences.${ index }.start_date` } render={ ( { field } ) => (
														<FormItem><FormLabel>Start Date</FormLabel><FormControl><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={ cn( "w-full text-left", !field.value && "text-muted-foreground" ) } data-error={ hasFieldError( `work_experiences.${ index }.start_date` ) ? "true" : "false" }>{ field.value ? format( field.value, "PPP" ) : "Pick a date" }<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent align="start" className="w-auto p-0"><Calendar mode="single" selected={ field.value ?? undefined } onSelect={ field.onChange } disabled={ date => date > new Date() } captionLayout="dropdown" /></PopoverContent></Popover></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `work_experiences.${ index }.end_date` } render={ ( { field } ) => (
														<FormItem><FormLabel>End Date</FormLabel><FormControl><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={ cn( "w-full text-left", !field.value && "text-muted-foreground" ) } disabled={ watch( `work_experiences.${ index }.is_current` ) } data-error={ hasFieldError( `work_experiences.${ index }.end_date` ) ? "true" : "false" }>{ field.value ? format( field.value, "PPP" ) : "Pick a date" }<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent align="start" className="w-auto p-0"><Calendar mode="single" selected={ field.value ?? undefined } onSelect={ field.onChange } disabled={ date => date > new Date() } captionLayout="dropdown" /></PopoverContent></Popover></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `work_experiences.${ index }.is_current` } render={ ( { field } ) => (
														<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={ field.value } onCheckedChange={ field.onChange } data-error={ hasFieldError( `work_experiences.${ index }.is_current` ) ? "true" : "false" } /></FormControl><div className="space-y-1 leading-none"><FormLabel>I currently work here</FormLabel></div></FormItem>
													) } />
												</div>
											</div>
										) ) }
										<Button type="button" variant="outline" onClick={ () => workExperienceFields.append( { title: "", company_name: "", start_date: new Date(), is_current: false } ) }><Plus size={ 16 } className="mr-2" /> Add Experience</Button>
									</div>
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button>
								</div>
							</TabsContent>

							<TabsContent value="education" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Education</CardTitle>
									<Separator />
									<div className="space-y-4 mt-4">
										{ educationFields.fields.map( ( field, index ) => (
											<div key={ field.id } className="border rounded-lg p-4">
												<div className="flex justify-between items-center mb-4">
													<h3 className="font-medium">Education #{ index + 1 }</h3>
													<Button type="button" variant="ghost" size="icon" onClick={ () => educationFields.remove( index ) }><Trash2 size={ 16 } /></Button>
												</div>
												<div className="grid md:grid-cols-2 gap-4">
													<FormField control={ control } name={ `educations.${ index }.course_title` } render={ ( { field } ) => (
														<FormItem><FormLabel>Course Title</FormLabel><FormControl><Input { ...field } data-error={ hasFieldError( `educations.${ index }.course_title` ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `educations.${ index }.institution` } render={ ( { field } ) => (
														<FormItem><FormLabel>Institution</FormLabel><FormControl><Input { ...field } data-error={ hasFieldError( `educations.${ index }.institution` ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `educations.${ index }.course_type` } render={ ( { field } ) => (
														<FormItem><FormLabel>Course Type</FormLabel><FormControl><Select onValueChange={ field.onChange } value={ field.value }><SelectTrigger data-error={ hasFieldError( `educations.${ index }.course_type` ) ? "true" : "false" }><SelectValue placeholder="Select course type" /></SelectTrigger><SelectContent><SelectItem value="Full-time">Full-time</SelectItem><SelectItem value="Part-time">Part-time</SelectItem><SelectItem value="Online">Online</SelectItem></SelectContent></Select></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `educations.${ index }.start_date` } render={ ( { field } ) => (
														<FormItem><FormLabel>Start Date</FormLabel><FormControl><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={ cn( "w-full text-left", !field.value && "text-muted-foreground" ) } data-error={ hasFieldError( `educations.${ index }.start_date` ) ? "true" : "false" }>{ field.value ? format( field.value, "PPP" ) : "Pick a date" }<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent align="start" className="w-auto p-0"><Calendar mode="single" selected={ field.value ?? undefined } onSelect={ field.onChange } disabled={ date => date > new Date() } captionLayout="dropdown" /></PopoverContent></Popover></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `educations.${ index }.end_date` } render={ ( { field } ) => (
														<FormItem><FormLabel>End Date</FormLabel><FormControl><Popover><PopoverTrigger asChild><FormControl><Button variant="outline" className={ cn( "w-full text-left", !field.value && "text-muted-foreground" ) } disabled={ watch( `educations.${ index }.is_current` ) } data-error={ hasFieldError( `educations.${ index }.end_date` ) ? "true" : "false" }>{ field.value ? format( field.value, "PPP" ) : "Pick a date" }<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent align="start" className="w-auto p-0"><Calendar mode="single" selected={ field.value ?? undefined } onSelect={ field.onChange } disabled={ date => date > new Date() } captionLayout="dropdown" /></PopoverContent></Popover></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `educations.${ index }.is_current` } render={ ( { field } ) => (
														<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={ field.value } onCheckedChange={ field.onChange } data-error={ hasFieldError( `educations.${ index }.is_current` ) ? "true" : "false" } /></FormControl><div className="space-y-1 leading-none"><FormLabel>Currently studying here</FormLabel></div></FormItem>
													) } />
												</div>
											</div>
										) ) }
										<Button type="button" variant="outline" onClick={ () => educationFields.append( { course_title: "", institution: "", course_type: "", start_date: new Date(), is_current: false } ) }><Plus size={ 16 } className="mr-2" /> Add Education</Button>
									</div>
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button>
								</div>
							</TabsContent>

							<TabsContent value="certifications" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Certifications</CardTitle>
									<Separator />
									<div className="space-y-4 mt-4">
										{ certificateFields.fields.map( ( field, index ) => (
											<div key={ field.id } className="border rounded-lg p-4">
												<div className="flex justify-between items-center mb-4">
													<h3 className="font-medium">Certification #{ index + 1 }</h3>
													<Button type="button" variant="ghost" size="icon" onClick={ () => certificateFields.remove( index ) }><Trash2 size={ 16 } /></Button>
												</div>
												<FormField control={ control } name={ `certificates.${ index }.name` } render={ ( { field } ) => (
													<FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input { ...field } data-error={ hasFieldError( `certificates.${ index }.name` ) ? "true" : "false" } /></FormControl><FormMessage /></FormItem>
												) } />
											</div>
										) ) }
										<Button type="button" variant="outline" onClick={ () => certificateFields.append( { name: "" } ) }><Plus size={ 16 } className="mr-2" /> Add Certification</Button>
									</div>
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button>
								</div>
							</TabsContent>

							<TabsContent value="languages" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Languages</CardTitle>
									<Separator />
									<div className="space-y-4 mt-4">
										{ languageFields.fields.map( ( field, index ) => (
											<div key={ field.id } className="border rounded-lg p-4">
												<div className="flex justify-between items-center mb-4">
													<h3 className="font-medium">Language #{ index + 1 }</h3>
													<Button type="button" variant="ghost" size="icon" onClick={ () => languageFields.remove( index ) }><Trash2 size={ 16 } /></Button>
												</div>
												<div className="grid md:grid-cols-2 gap-4">
													<FormField control={ control } name={ `user_languages.${ index }.language_id` } render={ ( { field } ) => (
														<FormItem><FormLabel>Language</FormLabel><FormControl><Select onValueChange={ field.onChange } value={ field.value }><SelectTrigger data-error={ hasFieldError( `user_languages.${ index }.language_id` ) ? "true" : "false" }><SelectValue placeholder="Select language" /></SelectTrigger><SelectContent>{ languages.map( language => ( <SelectItem key={ language.value } value={ language.value }>{ language.label }</SelectItem> ) ) }</SelectContent></Select></FormControl><FormMessage /></FormItem>
													) } />
													<FormField control={ control } name={ `user_languages.${ index }.proficiency` } render={ ( { field } ) => (
														<FormItem><FormLabel>Proficiency</FormLabel><FormControl><Select onValueChange={ field.onChange } value={ field.value }><SelectTrigger data-error={ hasFieldError( `user_languages.${ index }.proficiency` ) ? "true" : "false" }><SelectValue placeholder="Select proficiency" /></SelectTrigger><SelectContent><SelectItem value="beginner">Beginner</SelectItem><SelectItem value="intermediate">Intermediate</SelectItem><SelectItem value="proficient">Proficient</SelectItem><SelectItem value="fluent">Fluent</SelectItem><SelectItem value="native">Native</SelectItem></SelectContent></Select></FormControl><FormMessage /></FormItem>
													) } />
													<div className="md:col-span-2">
														<FormLabel>Language Skills</FormLabel>
														<div className="grid grid-cols-3 gap-4 mt-2">
															<FormField control={ control } name={ `user_languages.${ index }.can_read` } render={ ( { field } ) => (
																<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={ field.value } onCheckedChange={ field.onChange } data-error={ hasFieldError( `user_languages.${ index }.can_read` ) ? "true" : "false" } /></FormControl><FormLabel>Can Read</FormLabel></FormItem>
															) } />
															<FormField control={ control } name={ `user_languages.${ index }.can_write` } render={ ( { field } ) => (
																<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={ field.value } onCheckedChange={ field.onChange } data-error={ hasFieldError( `user_languages.${ index }.can_write` ) ? "true" : "false" } /></FormControl><FormLabel>Can Write</FormLabel></FormItem>
															) } />
															<FormField control={ control } name={ `user_languages.${ index }.can_speak` } render={ ( { field } ) => (
																<FormItem className="flex flex-row items-start space-x-3 space-y-0"><FormControl><Checkbox checked={ field.value } onCheckedChange={ field.onChange } data-error={ hasFieldError( `user_languages.${ index }.can_speak` ) ? "true" : "false" } /></FormControl><FormLabel>Can Speak</FormLabel></FormItem>
															) } />
														</div>
													</div>
												</div>
											</div>
										) ) }
										<Button type="button" variant="outline" onClick={ () => languageFields.append( { language_id: "", proficiency: "basic", can_read: false, can_write: false, can_speak: false } ) }><Plus size={ 16 } className="mr-2" /> Add Language</Button>
									</div>
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="button" onClick={ () => setCurrentStep( currentStep + 1 ) }>Next</Button>
								</div>
							</TabsContent>

							<TabsContent value="review" className="w-full">
								<Card className="p-4 sm:p-6">
									<CardTitle>Review & Submit</CardTitle>
									<Separator />
									<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
										<div><h3 className="font-medium">Account Details</h3><p><strong>Name:</strong> { watch( "name" ) }</p><p><strong>Email:</strong> { watch( "email" ) }</p><p><strong>Phone:</strong> { watch( "phone" ) }</p><p><strong>Password:</strong> { watch( "password" ) ? "Set" : "Not Set" }</p></div>
										<div><h3 className="font-medium">Personal Details</h3><p><strong>Gender:</strong> { watch( "personal_detail.gender" ) }</p><p><strong>Marital Status:</strong> { watch( "personal_detail.marital_status" ) }</p><p><strong>Date of Birth:</strong> { formatDateSafely( watch( "personal_detail.date_of_birth" ) ) }</p><p><strong>Differently Abled:</strong> { watch( "personal_detail.differently_abled" ) ? "Yes" : "No" }</p><p><strong>Address:</strong> { locationOptions.find( loc => loc.value === watch( "address.location_id" ) )?.label || "N/A" }</p></div>
										<div><h3 className="font-medium">Profile</h3><p><strong>Job Title:</strong> { watch( "profile.job_title" ) }</p><p><strong>Experience:</strong> { watch( "profile.experience" ) }</p><p><strong>Notice Period:</strong> { watch( "profile.notice_period" ) }</p><p><strong>Summary:</strong> { watch( "profile.summary" ) }</p></div>
										<div>
											<h3 className="font-medium">Skills</h3>
											<p>
												{ Array.isArray( watch( "skills" ) )
													? watch( "skills" )
														.map( skill => skillOptions.find( opt => opt.value === skill )?.label )
														.join( ", " )
													: "" }
											</p>
										</div>
										<div><h3 className="font-medium">Employment</h3>{ workExperienceFields.fields.map( ( we, index ) => ( <div key={ we.id } className="border-b last:border-b-0 py-2"><p><strong>Experience { index + 1 }:</strong> { watch( `work_experiences.${ index }.title` ) } at { watch( `work_experiences.${ index }.company_name` ) }</p><p>Start: { formatDateSafely( watch( `work_experiences.${ index }.start_date` ) ) }</p><p>End: { formatDateSafely( watch( `work_experiences.${ index }.end_date` ) ) }</p><p>Current: { watch( `work_experiences.${ index }.is_current` ) ? "Yes" : "No" }</p></div> ) ) }</div>
										<div><h3 className="font-medium">Education</h3>{ educationFields.fields.map( ( edu, index ) => ( <div key={ edu.id } className="border-b last:border-b-0 py-2"><p><strong>Education { index + 1 }:</strong> { watch( `educations.${ index }.course_title` ) } at { watch( `educations.${ index }.institution` ) }</p><p>Course Type: { watch( `educations.${ index }.course_type` ) }</p><p>Start: { formatDateSafely( watch( `educations.${ index }.start_date` ) ) }</p><p>End: { formatDateSafely( watch( `educations.${ index }.end_date` ) ) }</p><p>Current: { watch( `educations.${ index }.is_current` ) ? "Yes" : "No" }</p></div> ) ) }</div>
										<div><h3 className="font-medium">Certifications</h3>{ certificateFields.fields.map( ( cert, index ) => ( <div key={ cert.id } className="border-b last:border-b-0 py-2"><p><strong>Certification { index + 1 }:</strong> { watch( `certificates.${ index }.name` ) }</p></div> ) ) }</div>
										<div><h3 className="font-medium">Languages</h3>{ languageFields.fields.map( ( lang, index ) => ( <div key={ lang.id } className="border-b last:border-b-0 py-2"><p><strong>Language { index + 1 }:</strong> { languages.find( l => l.value === watch( `user_languages.${ index }.language_id` ) )?.label } - Proficiency: { watch( `user_languages.${ index }.proficiency` ) }</p><p>Can Read: { watch( `user_languages.${ index }.can_read` ) ? "Yes" : "No" }</p><p>Can Write: { watch( `user_languages.${ index }.can_write` ) ? "Yes" : "No" }</p><p>Can Speak: { watch( `user_languages.${ index }.can_speak` ) ? "Yes" : "No" }</p></div> ) ) }</div>
									</div>
								</Card>
								<div className="flex justify-between mt-4">
									<Button type="button" onClick={ () => setCurrentStep( currentStep - 1 ) }>Back</Button>
									<Button type="submit">{ operationLabel }</Button>
								</div>
							</TabsContent>
						</Tabs>
						{ operation === "Edit" && <DeleteAlert alertOpen={ alertOpen } setAlertOpen={ setAlertOpen } onDelete={ handleDelete } /> }
					</form>
				</Form>
			</div>
		</AppLayout>
	);
};

export default CreateOrEditStudent;