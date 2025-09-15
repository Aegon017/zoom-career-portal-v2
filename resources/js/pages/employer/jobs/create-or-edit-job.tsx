import DeleteAlert from "@/components/delete-alert";
import MultipleSelector from "@/components/multiple-selector";
import TextEditor from "@/components/text-editor";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import AppLayout from "@/layouts/employer-layout";
import { cn } from "@/lib/utils";
import { BreadcrumbItem, Opening, Option } from "@/types";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const CreateOrEditJob = ( {
	job,
	operation,
	operationLabel,
	skillOptions,
	employmentTypeOptions,
	workModelOptions,
	salaryUnitOptions,
	currencyOptions,
	jobStatusOptions,
}: {
	job?: Opening;
	operation: string;
	operationLabel: string;
	skillOptions: Option[];
	employmentTypeOptions: Option[];
	workModelOptions: Option[];
	salaryUnitOptions: Option[];
	currencyOptions: Option[];
	jobStatusOptions: Option[];
} ) => {
	const [ alertOpen, setAlertOpen ] = useState( false );

	const form = useForm( {
		defaultValues: {
			title: job?.title || "",
			skills: job?.skills.map( ( s ) => ( { value: String( s.id ), label: s.name } ) ) || [],
			description: job?.description || "",
			employment_type: job?.employment_type ? [ { value: job.employment_type, label: job.employment_type } ] : [],
			work_model: job?.work_model ? [ { value: job.work_model, label: job.work_model } ] : [],
			salary_min: job?.salary_min || 0,
			salary_max: job?.salary_max || 0,
			salary_unit: job?.salary_unit ? [ { value: job.salary_unit, label: job.salary_unit } ] : [],
			currency: job?.currency ? [ { value: job.currency, label: job.currency } ] : [],
			location_id: job?.address?.location_id ? [ {
				value: String( job.address.location.id ),
				label: job.address.location.full_name,
			} ] : [],
			industry_id: job?.industry ? [ { value: String( job.industry.id ), label: job.industry.name } ] : [],
			expires_at: job?.expires_at ? new Date( job.expires_at ) : null,
			apply_link: job?.apply_link || "",
			status: job?.status ? [ { value: job.status, label: job.status } ] : [],
			domain_id: [],
		},
	} );

	const { handleSubmit, control, watch, setValue, setError } = form;

	const onSubmit = ( data: any ) => {
		const handleErrors = ( errors: any ) => {
			if ( errors && typeof errors === "object" ) {
				Object.entries( errors ).forEach( ( [ field, message ] ) => {
					setError( field as any, { type: "server", message: message as string } );
				} );
			}
		};

		const formData = {
			...data,
			skills: data.skills.map( ( s: Option ) => s.value ),
			employment_type: data.employment_type[ 0 ]?.value,
			work_model: data.work_model[ 0 ]?.value,
			salary_unit: data.salary_unit[ 0 ]?.value,
			currency: data.currency[ 0 ]?.value,
			location_id: data.location_id[ 0 ]?.value,
			industry_id: data.industry_id[ 0 ]?.value,
			status: data.status[ 0 ]?.value,
		};

		if ( operation === "Edit" && job?.id ) {
			router.put( `/employer/jobs/${ job.id }`, formData, {
				onSuccess: () => toast.success( "Job updated successfully" ),
				onError: handleErrors,
			} );
		} else {
			router.post( "/employer/jobs", formData, {
				onSuccess: () => toast.success( "Job created successfully" ),
				onError: handleErrors,
			} );
		}
	};

	const handleDelete = ( id: number ) => {
		router.delete( `/employer/jobs/${ id }`, {
			onSuccess: () => toast.success( "Job deleted successfully" ),
			onError: () => toast.error( "Failed to delete job" ),
		} );
	};

	const breadcrumbs: BreadcrumbItem[] = [
		{ title: "Jobs", href: "/employer/jobs" },
		{ title: operation, href: "" },
	];

	const searchLocations = async ( searchTerm: string ) => {
		const response = await axios.get( "/locations/search", { params: { search: searchTerm } } );
		return response.data;
	};

	const searchIndustries = async ( searchTerm: string ) => {
		const response = await axios.get( "/industries/search", { params: { search: searchTerm } } );
		return response.data;
	};

	const selectedDomain = watch( "domain_id" );

	useEffect( () => {
		if ( selectedDomain?.length > 0 ) {
			const domainId = selectedDomain[ 0 ].value;
			axios.get( `/admin/domains/${ domainId }/skills` )
				.then( ( { data } ) => {
					const domainSkills = data.map( ( skill: any ) => ( {
						value: String( skill.id ),
						label: skill.name,
					} ) );
					setValue( "skills", ( prev: Option[] ) => {
						const existingSkills = new Set( prev.map( s => s.value ) );
						const newSkills = domainSkills.filter( ( s: Option ) => !existingSkills.has( s.value ) );
						return [ ...prev, ...newSkills ];
					} );
				} )
				.catch( console.error );
		}
	}, [ selectedDomain, setValue ] );

	const searchDomains = async ( searchTerm: string ) => {
		try {
			const response = await axios.get( "/admin/domains/search", { params: { search: searchTerm } } );
			return response.data.map( ( domain: any ) => ( {
				value: String( domain.id ),
				label: domain.name,
			} ) );
		} catch ( error ) {
			console.error( "Error searching domains:", error );
			return [];
		}
	};

	return (
		<AppLayout breadcrumbs={ breadcrumbs }>
			<Head title={ `${ operation } Job` } />
			<div className="flex flex-col gap-6 p-6">
				<Form { ...form }>
					<form onSubmit={ handleSubmit( onSubmit ) } className="space-y-8">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-semibold">{ operation } Job</h1>
							{ operation === "Edit" && job?.id && (
								<>
									<Button
										variant="destructive"
										onClick={ ( e ) => {
											e.preventDefault();
											setAlertOpen( true );
										} }
									>
										Delete
									</Button>
									<DeleteAlert
										alertOpen={ alertOpen }
										setAlertOpen={ setAlertOpen }
										onDelete={ () => job.id && handleDelete( job.id ) }
									/>
								</>
							) }
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<div className="space-y-6 md:col-span-2">
								<FormField
									name="title"
									control={ control }
									rules={ { required: "Job title is required" } }
									render={ ( { field } ) => (
										<FormItem>
											<FormLabel>Job Title</FormLabel>
											<FormControl>
												<Input { ...field } />
											</FormControl>
											<FormMessage />
										</FormItem>
									) }
								/>

								<FormField
									name="domain_id"
									control={ control }
									render={ ( { field } ) => (
										<FormItem>
											<FormLabel>Select Domain</FormLabel>
											<FormControl>
												<MultipleSelector
													value={ field.value }
													onChange={ field.onChange }
													onSearch={ searchDomains }
													maxSelected={ 1 }
													triggerSearchOnFocus
													placeholder="Search domain..."
													loadingIndicator={
														<p className="text-muted-foreground py-2 text-center">Searching domains...</p>
													}
													emptyIndicator={
														<p className="text-muted-foreground w-full text-center">No domains found</p>
													}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									) }
								/>

								<FormField
									name="skills"
									control={ control }
									render={ ( { field } ) => (
										<FormItem>
											<FormLabel>Required Skills</FormLabel>
											<FormControl>
												<MultipleSelector
													options={ skillOptions }
													value={ field.value }
													onChange={ field.onChange }
													placeholder="Select skills..."
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									) }
								/>

								<FormField
									name="description"
									control={ control }
									rules={ { required: "Job description is required" } }
									render={ ( { field } ) => (
										<FormItem>
											<FormLabel>Job Description</FormLabel>
											<FormControl>
												<TextEditor
													disabled={ false }
													value={ field.value }
													onChange={ field.onChange }
													placeholder="Enter job description..."
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									) }
								/>
							</div>

							<div className="border-t pt-6 md:col-span-2">
								<h2 className="mb-4 text-xl font-semibold">Employment Details</h2>
								<div className="grid gap-6 md:grid-cols-2">
									<FormField
										control={ control }
										name="employment_type"
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Employment Type</FormLabel>
												<FormControl>
													<MultipleSelector
														options={ employmentTypeOptions }
														value={ field.value }
														onChange={ field.onChange }
														maxSelected={ 1 }
														placeholder="Select type..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										control={ control }
										name="work_model"
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Work Mode</FormLabel>
												<FormControl>
													<MultipleSelector
														options={ workModelOptions }
														value={ field.value }
														onChange={ field.onChange }
														maxSelected={ 1 }
														placeholder="Select model..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										control={ control }
										name="location_id"
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Location</FormLabel>
												<FormControl>
													<MultipleSelector
														value={ field.value }
														onChange={ field.onChange }
														onSearch={ searchLocations }
														maxSelected={ 1 }
														triggerSearchOnFocus
														placeholder="Search location..."
														loadingIndicator={
															<p className="text-muted-foreground py-2 text-center">Searching locations...</p>
														}
														emptyIndicator={
															<p className="text-muted-foreground w-full text-center">No locations found</p>
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										control={ control }
										name="industry_id"
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Industry</FormLabel>
												<FormControl>
													<MultipleSelector
														value={ field.value }
														onChange={ field.onChange }
														onSearch={ searchIndustries }
														maxSelected={ 1 }
														triggerSearchOnFocus
														placeholder="Search industry..."
														loadingIndicator={
															<p className="text-muted-foreground py-2 text-center">Searching industries...</p>
														}
														emptyIndicator={
															<p className="text-muted-foreground w-full text-center">No industries found</p>
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>
								</div>
							</div>

							<div className="border-t pt-6 md:col-span-2">
								<h2 className="mb-4 text-xl font-semibold">Compensation</h2>
								<div className="grid gap-6 md:grid-cols-2">
									<FormField
										name="salary_min"
										control={ control }
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Min Salary</FormLabel>
												<FormControl>
													<Input
														{ ...field }
														onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										name="salary_max"
										control={ control }
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Max Salary</FormLabel>
												<FormControl>
													<Input
														{ ...field }
														onChange={ ( e ) => field.onChange( Number( e.target.value ) ) }
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										control={ control }
										name="salary_unit"
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Salary Unit</FormLabel>
												<FormControl>
													<MultipleSelector
														options={ salaryUnitOptions }
														value={ field.value }
														onChange={ field.onChange }
														maxSelected={ 1 }
														placeholder="Select unit..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										control={ control }
										name="currency"
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Currency</FormLabel>
												<FormControl>
													<MultipleSelector
														options={ currencyOptions }
														value={ field.value }
														onChange={ field.onChange }
														maxSelected={ 1 }
														placeholder="Select currency..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>
								</div>
							</div>

							<div className="border-t pt-6 md:col-span-2">
								<h2 className="mb-4 text-xl font-semibold">Additional Information</h2>
								<div className="grid gap-6 md:grid-cols-2">
									<FormField
										name="expires_at"
										control={ control }
										rules={ { required: "Please select expiry date" } }
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Expiry Date</FormLabel>
												<Popover>
													<PopoverTrigger asChild>
														<FormControl>
															<Button
																variant="outline"
																className={ cn( "w-full text-left", !field.value && "text-muted-foreground" ) }
															>
																{ field.value ? format( field.value, "PPP" ) : "Pick a date" }
																<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
															</Button>
														</FormControl>
													</PopoverTrigger>
													<PopoverContent align="start" className="w-auto p-0">
														<Calendar
															mode="single"
															selected={ field.value ?? undefined }
															onSelect={ field.onChange }
															disabled={ ( date ) => date < new Date() }
															autoFocus
															captionLayout="dropdown"
														/>
													</PopoverContent>
												</Popover>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										name="apply_link"
										control={ control }
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>External Apply Link (optional)</FormLabel>
												<FormControl>
													<Input
														type="url"
														placeholder="https://example.com/apply"
														{ ...field }
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>

									<FormField
										control={ control }
										name="status"
										render={ ( { field } ) => (
											<FormItem>
												<FormLabel>Status</FormLabel>
												<FormControl>
													<MultipleSelector
														options={ jobStatusOptions }
														value={ field.value }
														onChange={ field.onChange }
														maxSelected={ 1 }
														placeholder="Select status..."
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										) }
									/>
								</div>
							</div>
						</div>

						<div className="flex justify-start gap-4 pt-6">
							<Button type="submit">{ operationLabel }</Button>
							<Button
								type="button"
								variant="outline"
								onClick={ () => router.get( "/employer/jobs" ) }
							>
								Cancel
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</AppLayout>
	);
};

export default CreateOrEditJob;