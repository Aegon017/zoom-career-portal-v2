import { Option } from '@/types';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import FileUpload from './file-upload';
import { PhoneInput } from './phone-input';
import { SelectPopoverField } from './select-popover-field';
import { Button } from './ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';

interface FormValues {
    name: string;
    logo_url: string;
    banner_url: string;
    industry_id: string;
    website_url: string;
    description: string;
    location_id: string;
    size: string;
    type: string;
    phone: string;
    email: string;
}

interface Props {
    form: any;
    control: any;
    handleSubmit: ( callback: ( data: any ) => void ) => ( event: React.FormEvent<HTMLFormElement> ) => void;
    onSubmit: ( data: any ) => void;
    setValue: ( name: keyof FormValues, value: any ) => void;
    industries: Option[];
    locations: Option[];
    sizes: Option[];
    types: Option[];
}

const CompanyForm = ( {
    form,
    control,
    handleSubmit,
    onSubmit,
    setValue,
    sizes,
    types,
    industries,
    locations,
}: Props ) => {
    const [ locationSearch, setLocationSearch ] = useState( '' );
    const [ locationOptions, setLocationOptions ] = useState<Option[]>( locations );
    const [ industrySearch, setIndustrySearch ] = useState( '' );
    const [ industryOptions, setIndustryOptions ] = useState<Option[]>( industries );

    const fetchLocations = useCallback( async ( search: string ) => {
        try {
            const response = await axios.get( '/locations/search', { params: { search } } );
            setLocationOptions( response.data );
        } catch ( error ) {
            console.error( 'Error fetching locations:', error );
        }
    }, [] );

    const fetchIndustries = useCallback( async ( search: string ) => {
        try {
            const response = await axios.get( '/industries/search', { params: { search } } );
            setIndustryOptions( response.data );
        } catch ( error ) {
            console.error( 'Error fetching industries:', error );
        }
    }, [] );

    useEffect( () => {
        const timeout = setTimeout( () => {
            if ( locationSearch.trim() ) {
                fetchLocations( locationSearch );
            } else {
                setLocationOptions( locations );
            }
        }, 300 );
        return () => clearTimeout( timeout );
    }, [ locationSearch, fetchLocations, locations ] );

    useEffect( () => {
        const timeout = setTimeout( () => {
            if ( industrySearch.trim() ) {
                fetchIndustries( industrySearch );
            } else {
                setIndustryOptions( industries );
            }
        }, 300 );
        return () => clearTimeout( timeout );
    }, [ industrySearch, fetchIndustries, industries ] );

    const handleFileUpload = useCallback( ( field: keyof FormValues ) => ( tempPath: string ) => {
        setValue( field, tempPath );
    }, [ setValue ] );

    const renderRadioOptions = useCallback(
        ( options: Option[], field: any, name: string ) => (
            <RadioGroup { ...field } onValueChange={ field.onChange } className="mt-2 flex flex-wrap gap-x-1 gap-y-4">
                { options.map( ( option, index ) => {
                    const id = `${ name }-${ index }`;
                    const isSelected = field.value === option.value;
                    return (
                        <div key={ id }>
                            <RadioGroupItem value={ option.value } id={ id } className="peer sr-only" />
                            <Label
                                htmlFor={ id }
                                className={ `cursor-pointer rounded-sm border px-4 py-2 text-center text-sm font-medium transition-colors ${ isSelected ? 'border-orange-600' : 'border-gray-300'
                                    }` }
                            >
                                { option.label }
                            </Label>
                        </div>
                    );
                } ) }
            </RadioGroup>
        ),
        []
    );

    return (
        <Form { ...form }>
            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-6">
                <FormField
                    control={ control }
                    name="name"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>Company name</FormLabel>
                            <FormControl>
                                <Input { ...field } />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <FormField
                    control={ control }
                    name="logo_url"
                    render={ () => (
                        <FormItem>
                            <FormLabel>Company logo (Optional)</FormLabel>
                            <FormControl>
                                <FileUpload
                                    acceptedFileTypes={ [ 'image/*' ] }
                                    placeholder="Drag & Drop your company logo"
                                    name="file"
                                    onUploaded={ handleFileUpload( 'logo_url' ) }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <FormField
                    control={ control }
                    name="banner_url"
                    render={ () => (
                        <FormItem>
                            <FormLabel>Company banner (Optional)</FormLabel>
                            <FormControl>
                                <FileUpload
                                    acceptedFileTypes={ [ 'image/*' ] }
                                    placeholder="Drag & Drop your company banner"
                                    name="file"
                                    onUploaded={ handleFileUpload( 'banner_url' ) }
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <SelectPopoverField
                    options={ industryOptions }
                    name="industry_id"
                    control={ control }
                    label="Industry"
                    placeholder="Select industry"
                    onValueChange={ setIndustrySearch }
                />
                <FormField
                    control={ control }
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
                    control={ control }
                    name="description"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea { ...field } />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <SelectPopoverField
                    options={ locationOptions }
                    name="location_id"
                    control={ control }
                    label="Address"
                    placeholder="Select Address"
                    onValueChange={ setLocationSearch }
                />
                <FormField
                    control={ control }
                    name="email"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>Company email</FormLabel>
                            <FormControl>
                                <Input type="email" { ...field } />
                            </FormControl>
                            <FormDescription>This email is <strong>mandatory</strong> for company verification.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <FormField
                    control={ control }
                    name="phone"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>Company phone</FormLabel>
                            <FormControl>
                                <PhoneInput type="tel" placeholder="Enter your company phone number" { ...field } />
                            </FormControl>
                            <FormDescription>This phone number is <strong>mandatory</strong> for company verification.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <FormField
                    control={ control }
                    name="size"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>Company size</FormLabel>
                            <FormControl>
                                { renderRadioOptions( sizes, field, 'size' ) }
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <FormField
                    control={ control }
                    name="type"
                    render={ ( { field } ) => (
                        <FormItem>
                            <FormLabel>Company type</FormLabel>
                            <FormControl>
                                { renderRadioOptions( types, field, 'type' ) }
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    ) }
                />
                <Button type="submit" className="w-full">
                    Submit
                </Button>
            </form>
        </Form>
    );
};

export default React.memo( CompanyForm );