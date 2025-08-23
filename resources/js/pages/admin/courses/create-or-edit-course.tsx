import AppLayout from '@/layouts/app-layout';
import DeleteAlert from '@/components/delete-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Course, Option, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormValues {
    name: string;
}

interface Props {
    course?: Course;
    operation: Option;
}

const CreateOrEditCourse = ( {
    course,
    operation,
}: Props ) => {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Courses', href: '/admin/courses' },
        { title: operation.value, href: '' },
    ];

    const form = useForm<FormValues>( {
        defaultValues: {
            name: course?.name || '',
        }
    } );

    const [ alertOpen, setAlertOpen ] = useState( false );

    const onSubmit = ( data: FormValues ) => {
        const handleErrors = ( errors: Record<string, string> ) => {
            Object.entries( errors ).forEach( ( [ field, message ] ) => {
                form.setError( field as keyof FormValues, { message } );
            } );
        };

        const submitData = {
            ...data,
        };

        operation.value === 'Create'
            ? router.post( '/admin/courses', submitData, { onError: handleErrors } )
            : router.put( `/admin/courses/${ course?.id }`, submitData, { onError: handleErrors } );
    };

    const handleDelete = () => {
        course && router.delete( `/admin/courses/${ course.id }` );
    };

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title={ `${ operation } Company` } />
            <div className="flex flex-col gap-6 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-foreground">{ operation.value } Course</h1>

                    { operation.value === 'Edit' && course && (
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
                                    <FormItem className="md:col-span-1">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit">{ operation.label }</Button>
                            <Button type="button" variant="outline" onClick={ () => router.get( '/admin/courses' ) }>
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout>
    );
};

export default CreateOrEditCourse;