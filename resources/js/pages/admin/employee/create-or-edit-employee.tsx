import DeleteAlert from '@/components/delete-alert';
import { PhoneInput } from '@/components/phone-input';
import { SelectPopoverField } from '@/components/select-popover-field';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { Option, User, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    employee?: User;
    operation: Option;
    companyOptions: Option[];
    errors?: Record<string, string>;
}

interface FormValues {
    name: string;
    email: string;
    phone: string;
    job_title: string;
    company_id: number | null;
    password?: string;
    verification_status: string;
}

const CreateOrEditEmployee = ( { employee, operation, companyOptions, errors: serverErrors }: Props ) => {
    const [ alertOpen, setAlertOpen ] = useState( false );
    const isEditMode = operation.value === 'Edit';

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Employees', href: '/admin/employees' },
        { title: operation.value, href: '' },
    ];

    const latestCompanyUser = employee?.company_users
        ?.slice()
        ?.sort( ( a, b ) => new Date( b.created_at ).getTime() - new Date( a.created_at ).getTime() )[ 0 ];

    const form = useForm<FormValues>( {
        defaultValues: {
            name: employee?.name || '',
            email: employee?.email || '',
            phone: employee?.phone || '',
            job_title: employee?.profile?.job_title || '',
            company_id: latestCompanyUser?.company_id || null,
            password: '',
            verification_status: latestCompanyUser?.verification_status || 'pending',
        }
    } );

    // Handle server errors
    useEffect( () => {
        if ( serverErrors ) {
            Object.entries( serverErrors ).forEach( ( [ field, message ] ) => {
                form.setError( field as keyof FormValues, { message } );
            } );
        }
    }, [ serverErrors, form ] );

    const onSubmit = ( data: FormValues ) => {
        const payload = { ...data };

        // Remove password if empty in edit mode
        if ( isEditMode && !payload.password ) {
            delete payload.password;
        }

        const routes = {
            Create: () => router.post( '/admin/employees', payload ),
            Edit: () => router.put( `/admin/employees/${ employee?.id }`, payload )
        };

        routes[ operation.value as keyof typeof routes ]?.();
    };

    const handleDelete = () => {
        if ( employee ) router.delete( `/admin/employees/${ employee.id }` );
    };

    const handleCancel = () => router.get( '/admin/employees' );

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title={ `${ operation.value } employee` } />
            <div className="flex flex-col gap-4 p-4">
                <Form { ...form }>
                    <form onSubmit={ form.handleSubmit( onSubmit ) } className="space-y-8 p-4">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold">{ operation.value } employee</h1>
                            { isEditMode && employee && (
                                <Button
                                    variant="destructive"
                                    onClick={ () => setAlertOpen( true ) }
                                    type="button"
                                >
                                    Delete
                                </Button>
                            ) }
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                control={ form.control }
                                name="name"
                                rules={ { required: 'Employee name is required' } }
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Employee name</FormLabel>
                                        <FormControl>
                                            <Input { ...field } autoComplete="name" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="email"
                                rules={ {
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                } }
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input { ...field } autoComplete="email" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="phone"
                                rules={ { required: 'Phone number is required' } }
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <PhoneInput required { ...field } />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="password"
                                rules={ {
                                    required: isEditMode ? false : 'Password is required',
                                    minLength: isEditMode
                                        ? undefined
                                        : { value: 8, message: 'Password must be at least 8 characters' }
                                } }
                                render={ ( { field } ) => (
                                    <FormItem>
                                        <FormLabel>
                                            { isEditMode ? 'Password (leave blank to keep current)' : 'Password' }
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                { ...field }
                                                autoComplete="new-password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                ) }
                            />

                            <FormField
                                control={ form.control }
                                name="job_title"
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

                            <SelectPopoverField
                                options={ companyOptions }
                                name="company_id"
                                control={ form.control }
                                label="Company"
                                placeholder="Select company"
                                rules={ { required: 'Company is required' } }
                            />
                        </div>

                        <SelectPopoverField
                            name="verification_status"
                            control={ form.control }
                            label="Verification Status"
                            placeholder="Select status"
                            options={ [
                                { label: 'Pending', value: 'pending' },
                                { label: 'Approved', value: 'approved' },
                                { label: 'Rejected', value: 'rejected' },
                            ] }
                            rules={ { required: 'Verification status is required' } }
                        />

                        <div className="flex gap-4">
                            <Button
                                type="submit"
                            >
                                { operation.label }
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={ handleCancel }
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </Form>

                { isEditMode && employee && (
                    <DeleteAlert
                        alertOpen={ alertOpen }
                        setAlertOpen={ setAlertOpen }
                        onDelete={ handleDelete }
                    />
                ) }
            </div>
        </AppLayout>
    );
};

export default CreateOrEditEmployee;