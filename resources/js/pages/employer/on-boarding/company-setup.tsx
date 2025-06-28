import { AppHeader } from "@/components/employer/employer-header";
import FileUpload from "@/components/file-upload";
import { SelectPopoverField } from "@/components/select-popover-field";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Option } from "@/types";
import { Head, router } from "@inertiajs/react";
import { useForm } from "react-hook-form";

interface Props {
    name: string;
    industries: Option[];
    locations: Option[];
    sizes: Option[];
    types: Option[];
}

interface FormValues {
    name: string;
    logo_url: string;
    industry_id: string;
    website_url: string;
    description: string;
    location_id: string;
    size: string;
    type: string;
}

const CompanySetup = ( { name, industries, locations, sizes, types }: Props ) => {
    const form = useForm<FormValues>( {
        defaultValues: {
            name: name,
        },
    } );

    const { handleSubmit, control, setError, setValue } = form;

    const onSubmit = ( data: FormValues ) => {
        router.post( "/employer/on-boarding/setup/company", { ...data }, {
            onError: ( errors ) => {
                if ( errors && typeof errors === 'object' ) {
                    Object.entries( errors ).forEach( ( [ field, message ] ) => {
                        setError( field as keyof FormValues, {
                            type: "server",
                            message: message as string,
                        } );
                    } );
                }
            },
            preserveScroll: true,
        } );
    };

    return (
        <>
            <Head title="Setup Company" />
            <AppHeader />
            <div className="flex flex-1 justify-center p-8">
                <div className="w-full max-w-xl">
                    <h1 className="text-2xl font-bold text-center">Register Company</h1>
                    <p className="text-gray-500 text-center mt-2 text-sm">
                        Create your company account and start hiring talent
                    </p>
                    <div className="py-8">
                        <Form { ...form }>
                            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-6">
                                <FormField
                                    control={ control }
                                    name="name"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Company name</FormLabel>
                                            <FormControl><Input { ...field } /></FormControl>
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
                                                    acceptedFileTypes={ [ "image/*" ] }
                                                    placeholder="Drag & Drop your company logo"
                                                    name="file"
                                                    onUploaded={ ( tempPath ) => setValue( "logo_url", tempPath ) }
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <SelectPopoverField
                                    options={ industries }
                                    name="industry_id"
                                    control={ control }
                                    label="Industry"
                                    placeholder="Select industry"
                                />
                                <FormField
                                    control={ control }
                                    name="website_url"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Website URL</FormLabel>
                                            <FormControl><Input type="url" { ...field } /></FormControl>
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
                                            <FormControl><Textarea { ...field } /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <SelectPopoverField
                                    options={ locations }
                                    name="location_id"
                                    control={ control }
                                    label="Address"
                                    placeholder="Select Address"
                                />
                                <FormField
                                    control={ control }
                                    name="size"
                                    render={ ( { field } ) => (
                                        <FormItem>
                                            <FormLabel>Company size</FormLabel>
                                            <FormControl>
                                                <RadioGroup
                                                    { ...field }
                                                    onValueChange={ field.onChange }
                                                    className="flex flex-wrap gap-x-1 gap-y-4 mt-2"
                                                >
                                                    { sizes.map( ( size, index ) => {
                                                        const id = `size-${ index }`;
                                                        const isSelected = field.value === size.value;
                                                        return (
                                                            <div key={ id }>
                                                                <RadioGroupItem value={ size.value } id={ id } className="peer sr-only" />
                                                                <Label htmlFor={ id } className={ `cursor-pointer rounded-sm border px-4 py-2 text-center text-sm font-medium transition-colors ${ isSelected ? "border-orange-600" : "border-gray-300" }` }>
                                                                    { size.label }
                                                                </Label>
                                                            </div>
                                                        );
                                                    } ) }
                                                </RadioGroup>
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
                                                <RadioGroup
                                                    { ...field }
                                                    onValueChange={ field.onChange }
                                                    className="flex flex-wrap gap-x-1 gap-y-4 mt-2"
                                                >
                                                    { types.map( ( type, index ) => {
                                                        const id = `type-${ index }`;
                                                        const isSelected = field.value === type.value;
                                                        return (
                                                            <div key={ id }>
                                                                <RadioGroupItem value={ type.value } id={ id } className="peer sr-only" />
                                                                <Label htmlFor={ id } className={ `cursor-pointer rounded-sm border px-4 py-2 text-center text-sm font-medium transition-colors ${ isSelected ? "border-orange-600" : "border-gray-300" }` }>
                                                                    { type.label }
                                                                </Label>
                                                            </div>
                                                        );
                                                    } ) }
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    ) }
                                />
                                <Button type="submit" className="w-full">Submit</Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CompanySetup;
