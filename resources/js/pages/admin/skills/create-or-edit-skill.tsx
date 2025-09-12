import { Head, router } from "@inertiajs/react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import DeleteAlert from "@/components/delete-alert";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AppLayout from "@/layouts/app-layout";
import { Skill, type BreadcrumbItem } from "@/types";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface Domain {
	id: number;
	name: string;
}
type FormDataConvertible = string | number | boolean | File | Blob | null;

const CreateOrEditSkill = ( {
	skill,
	operation,
	operationLabel,
}: {
	skill: Skill;
	operation: string;
	operationLabel: string;
} ) => {
	const breadcrumbs = useMemo<BreadcrumbItem[]>(
		() => [
			{ title: "Skills", href: "/admin/skills" },
			{ title: operation, href: "" },
		],
		[ operation ]
	);

	const form = useForm<Skill & { domain_id: number | null }>( {
		defaultValues: {
			name: skill?.name ?? "",
			domain_id: skill?.domain_id ?? null,
		},
	} );

	const [ domains, setDomains ] = useState<Domain[]>( [] );
	const [ searchTerm, setSearchTerm ] = useState( "" );
	const [ loadingDomains, setLoadingDomains ] = useState( false );
	const [ alertOpen, setAlertOpen ] = useState( false );

	const fetchDomains = useCallback(
		async ( signal: AbortSignal ) => {
			setLoadingDomains( true );
			try {
				const { data } = await axios.get( "/admin/domains/search", {
					params: { search: searchTerm },
					signal,
				} );
				setDomains( data );
			} catch ( error ) {
				if ( !axios.isCancel( error ) ) console.error( "Error fetching domains", error );
			} finally {
				setLoadingDomains( false );
			}
		},
		[ searchTerm ]
	);

	useEffect( () => {
		const controller = new AbortController();
		const timeout = setTimeout( () => fetchDomains( controller.signal ), 300 );
		return () => {
			controller.abort();
			clearTimeout( timeout );
		};
	}, [ fetchDomains ] );

	const onSubmit = useCallback(
		( data: Skill & { domain_id: number | null } ) => {
			const handleErrors = ( errors: Record<string, string> ) => {
				Object.entries( errors ).forEach( ( [ field, message ] ) =>
					form.setError( field as keyof Skill, { type: "server", message } )
				);
			};

			const payload: Record<string, FormDataConvertible> = {
				name: data.name,
				domain_id: data.domain_id,
			};

			if ( operation === "Create" ) {
				router.post( "/admin/skills", payload, { onError: handleErrors } );
			} else {
				router.put( `/admin/skills/${ skill.id }`, payload, { onError: handleErrors } );
			}
		},
		[ operation, skill?.id, form ]
	);


	const handleDelete = useCallback(
		() => router.delete( `/admin/skills/${ skill.id }` ),
		[ skill?.id ]
	);

	const selectedDomain = useMemo(
		() => domains.find( ( d ) => d.id === form.watch( "domain_id" ) ),
		[ domains, form.watch( "domain_id" ) ]
	);

	useEffect( () => {
		if ( skill?.domain && !domains.find( d => d.id === skill.domain?.id ) ) {
			setDomains( prev => [ ...prev, skill.domain as Domain ] );
		}
	}, [ skill?.domain, domains ] );


	return (
		<AppLayout breadcrumbs={ breadcrumbs }>
			<Head title={ `${ operation } Skill` } />
			<div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
				<Form { ...form }>
					<form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8 p-4">
						<div className="flex justify-between">
							<h1 className="text-2xl font-bold">{ operation } Skill</h1>
							{ operation === "Edit" && (
								<>
									<Button variant="destructive" onClick={ () => setAlertOpen( true ) }>
										Delete
									</Button>
									<DeleteAlert
										alertOpen={ alertOpen }
										setAlertOpen={ setAlertOpen }
										onDelete={ handleDelete }
									/>
								</>
							) }
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<FormField
								control={ form.control }
								name="name"
								render={ ( { field } ) => (
									<FormItem>
										<FormLabel>Skill Name</FormLabel>
										<FormControl>
											<Input { ...field } autoComplete="name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								) }
							/>

							<FormField
								control={ form.control }
								name="domain_id"
								render={ ( { field } ) => (
									<FormItem>
										<FormLabel>Domain</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														role="combobox"
														className={ cn(
															"w-full justify-between",
															!selectedDomain && "text-muted-foreground"
														) }
													>
														{ selectedDomain?.name || "Select domain" }
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-[--radix-popover-trigger-width] p-0">
												<Command>
													<CommandInput
														placeholder="Search domains..."
														onValueChange={ setSearchTerm }
													/>
													<CommandList>
														{ domains.length > 0 ? (
															domains.map( ( domain ) => (
																<CommandItem
																	key={ domain.id }
																	value={ domain.name }
																	onSelect={ () => field.onChange( domain.id ) }
																>
																	{ domain.name }
																</CommandItem>
															) )
														) : (
															<CommandItem disabled>
																{ loadingDomains ? "Loading..." : "No domains found." }
															</CommandItem>
														) }
													</CommandList>
												</Command>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								) }
							/>
						</div>

						<div className="flex gap-4">
							<Button type="submit">{ operationLabel }</Button>
							<Button
								type="button"
								variant="outline"
								onClick={ () => router.get( "/admin/skills" ) }
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

export default CreateOrEditSkill;