import AppLayout from '@/layouts/app-layout';
import DeleteAlert from '@/components/delete-alert';
import FileUpload from '@/components/file-upload';
import { PhoneInput } from '@/components/phone-input';
import { SelectPopoverField } from '@/components/select-popover-field';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Company, Option, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FormValues {
    name: string;
    logo_url: string;
    banner_url: string;
    industry_id: number | null;
    website_url: string;
    description: string;
    location_id: number | null;
    size: string;
    type: string;
    phone: string;
    email: string;
    verification_status: string;
}

interface Props {
    company?: Company;
    operation: 'Create' | 'Edit';
    operationLabel: string;
    industries: Option[];
    sizes: Option[];
    types: Option[];
    locations: Option[];
    statusOptions: Option[];
}

const CreateOrEditCompany = ( {
    company,
    operation,
    operationLabel,
    industries,
    sizes,
    types,
    locations,
    statusOptions
}: Props ) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Companies', href: '/admin/companies' },
        { title: operation, href: '' },
    ];

    const form = useForm<FormValues>( {
        defaultValues: {
            name: company?.name || '',
            description: company?.description || '',
            logo_url: company?.logo_url || '',
            banner_url: company?.banner_url || '',
            industry_id: company?.industry_id || null,
            website_url: company?.website_url || '',
            location_id: company?.address?.location_id || null,
            type: company?.type || '',
            size: company?.size || '',
            phone: company?.phone || '',
            email: company?.email || '',
            verification_status: company?.verification_status || '',
        }
    } );

    const [ alertOpen, setAlertOpen ] = useState( false );
    const [ locationOptions, setLocationOptions ] = useState<Option[]>( locations );
    const [ industryOptions, setIndustryOptions ] = useState<Option[]>( industries );
    const [ locationSearch, setLocationSearch ] = useState( '' );
    const [ industrySearch, setIndustrySearch ] = useState( '' );

    useEffect( () => {
        form.reset( {
            ...form.getValues(),
            location_id: company?.address?.location_id || null
        } );
    }, [ company ] );

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
        const timeout = setTimeout( async () => {
            if ( locationSearch.trim() ) {
                const data = await fetchOptions( '/locations/search', locationSearch );
                setLocationOptions( data );
            } else {
                setLocationOptions( locations );
            }
        }, 300 );

        return () => clearTimeout( timeout );
    }, [ locationSearch, locations, fetchOptions ] );

    useEffect( () => {
        const timeout = setTimeout( async () => {
            if ( industrySearch.trim() ) {
                const data = await fetchOptions( '/industries/search', industrySearch );
                setIndustryOptions( data );
            } else {
                setIndustryOptions( industries );
            }
        }, 300 );

        return () => clearTimeout( timeout );
    }, [ industrySearch, industries, fetchOptions ] );

    const handleFileUpload = ( field: keyof FormValues ) =>
        ( tempPath: string ) => form.setValue( field, tempPath, { shouldDirty: true } );

    const onSubmit = ( data: FormValues ) => {
        const handleErrors = ( errors: Record<string, string> ) => {
            Object.entries( errors ).forEach( ( [ field, message ] ) => {
                form.setError( field as keyof FormValues, { message } );
            } );
        };

        const submitData = {
            ...data,
            location_id: data.location_id || null,
            industry_id: data.industry_id || null
        };

        operation === 'Create'
            ? router.post( '/admin/companies', submitData, { onError: handleErrors } )
            : router.put( `/admin/companies/${ company?.id }`, submitData, { onError: handleErrors } );
    };

    const handleDelete = () => {
        company && router.delete( `/admin/companies/${ company.id }` );
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title={ `${ operation } Company` } />
            <div className="flex flex-col gap-6 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground">{ operation } Company</h1>

                    { operation === 'Edit' && company && (
                        <>
                            <Button
                                variant="destructive"
                                onClick={ () => setAlertOpen( true ) }
                            >
                                Delete
                            </Button>
                            <DeleteAlert
                                alertOpen={ alertOpen }
                                setAlertOpen={ setAlertOpen }
                                onDelete={ () => handleDelete() }
                            />
                        </>
                    ) }
                </div>

                <Form { ...form }>
                    <form
                        onSubmit={ form.handleSubmit( onSubmit ) }
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={ form.control }
                                name="name"
                                render={ ( { field } ) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Company Name</FormLabel>
                                        <FormControl>
                                            <Input { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="logo_url"
                                render={ () => (
                                    <FormItem>
                                        <FormLabel>Company Logo</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                name='file'
                                                acceptedFileTypes={ [ 'image/*' ] }
                                                placeholder="Drag & Drop your company logo"
                                                onUploaded={ handleFileUpload( 'logo_url' ) }
                                                defaultValue={ company?.logo_url }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="banner_url"
                                render={ () => (
                                    <FormItem>
                                        <FormLabel>Company Banner</FormLabel>
                                        <FormControl>
                                            <FileUpload
                                                name="file"
                                                acceptedFileTypes={ [ 'image/*' ] }
                                                placeholder="Drag & Drop your company banner"
                                                onUploaded={ handleFileUpload( 'banner_url' ) }
                                                defaultValue={ company?.banner_url }
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <SelectPopoverField
                                options={ industryOptions }
                                name="industry_id"
                                control={ form.control }
                                label="Industry"
                                placeholder="Select industry"
                                onValueChange={ setIndustrySearch }
                            />

                            <FormField
                                control={ form.control }
                                name="website_url"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Website URL</FormLabel>
                                        <FormControl>
                                            <Input type="url" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="description"
                                render={ ( { field } ) => (
                                    <FormItem className="md:col-span-2">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea { ...field } rows={ 4 } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <SelectPopoverField
                                options={ locationOptions }
                                name="location_id"
                                control={ form.control }
                                label="Address"
                                placeholder="Select Address"
                                onValueChange={ setLocationSearch }
                            />

                            <FormField
                                control={ form.control }
                                name="email"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Company Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="phone"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Company Phone</FormLabel>
                                        <FormControl>
                                            <PhoneInput placeholder="Enter company phone" { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="verification_status"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Verification Status</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={ field.onChange } defaultValue={ field.value }>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    { statusOptions.map( option => (
                                                        <SelectItem key={ option.value } value={ option.value }>
                                                            { option.label }
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
                                control={ form.control }
                                name="size"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Company Size</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-2">
                                                { sizes.map( option => (
                                                    <Button
                                                        key={ option.value }
                                                        type="button"
                                                        variant={ field.value === option.value ? 'default' : 'outline' }
                                                        onClick={ () => field.onChange( option.value ) }
                                                    >
                                                        { option.label }
                                                    </Button>
                                                ) ) }
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="type"
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Company Type</FormLabel>
                                        <FormControl>
                                            <div className="flex flex-wrap gap-2">
                                                { types.map( option => (
                                                    <Button
                                                        key={ option.value }
                                                        type="button"
                                                        variant={ field.value === option.value ? 'default' : 'outline' }
                                                        onClick={ () => field.onChange( option.value ) }
                                                    >
                                                        { option.label }
                                                    </Button>
                                                ) ) }
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit">{ operationLabel }</Button>
                            <Button type="button" variant="outline" onClick={ () => router.get( '/admin/companies' ) }>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
};

export default CreateOrEditCompany;