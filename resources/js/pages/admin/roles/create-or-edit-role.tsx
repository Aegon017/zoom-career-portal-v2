import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Permission, Role } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

type GroupedPermissions = Record<string, Permission[]>;

interface CreateOrEditRoleProps {
    role: Role;
    operation: 'Create' | 'Edit';
    permissions: GroupedPermissions;
    operationLabel: string;
}

interface RoleFormData {
    name: string;
    permissions: number[];
}

const CreateOrEditRole = ( { role, operation, permissions, operationLabel }: CreateOrEditRoleProps ) => {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Roles',
            href: '/admin/roles',
        },
        {
            title: operation,
            href: '',
        },
    ];

    const form = useForm<RoleFormData>( {
        defaultValues: {
            name: role?.name ?? '',
            permissions: role?.permissions?.map( ( p ) => p.id ) ?? [],
        },
    } );

    const { handleSubmit, control, setError, watch, setValue } = form;
    const selectedPermissions = watch( 'permissions' ) || [];

    const onSubmit = ( data: RoleFormData ) => {
        const handleErrors = ( errors: any ) => {
            if ( errors && typeof errors === 'object' ) {
                Object.entries( errors ).forEach( ( [ field, message ] ) => {
                    setError( field as keyof RoleFormData, {
                        type: 'server',
                        message: message as string,
                    } );
                } );
            }
        };

        const routes = {
            Create: () => router.post( '/admin/roles', { ...data }, { onError: handleErrors } ),
            Edit: () => router.put( `/admin/roles/${ role.id }`, { ...data }, { onError: handleErrors } ),
        };

        routes[ operation ]?.();
    };

    const togglePermission = ( id: number ) => {
        const updated = selectedPermissions.includes( id ) ? selectedPermissions.filter( ( pid ) => pid !== id ) : [ ...selectedPermissions, id ];

        setValue( 'permissions', updated );
    };

    const capitalize = ( str: string ) => str.charAt( 0 ).toUpperCase() + str.slice( 1 );
    const formatPermissionLabel = ( str: string ) => str.split( '_' ).map( capitalize ).join( ' ' );

    return (
        <AppLayout breadcrumbs={ breadcrumbs }>
            <Head title={ `${ operation } Role` } />
            <div className="flex flex-col gap-4 p-4">
                <div className="grid grid-cols-1 gap-4">
                    <Form { ...form }>
                        <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-8">
                            {/* Role Details Card */ }
                            <Card className="p-8">
                                <CardTitle>Role Details</CardTitle>
                                <Separator className="my-4" />
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={ control }
                                        name="name"
                                        render={ ( { field } ) => (
                                            <FormItem>
                                                <FormLabel>Role Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter role name" { ...field } />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        ) }
                                    />
                                </div>
                            </Card>

                            {/* Permissions Grid */ }
                            <div className="grid gap-4 md:grid-cols-2">
                                { Object.entries( permissions ).map( ( [ group, perms ] ) => (
                                    <Card key={ group } className="p-8">
                                        <CardTitle>{ capitalize( group ) } Permissions</CardTitle>
                                        <Separator className="my-4" />
                                        <div className="flex flex-wrap gap-6">
                                            { perms.map( ( { id, name } ) => (
                                                <div key={ id } className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={ `perm-${ id }` }
                                                        checked={ selectedPermissions.includes( id ) }
                                                        onCheckedChange={ () => togglePermission( id ) }
                                                    />
                                                    <label htmlFor={ `perm-${ id }` } className="text-sm font-medium">
                                                        { formatPermissionLabel( name ) }
                                                    </label>
                                                </div>
                                            ) ) }
                                        </div>
                                    </Card>
                                ) ) }
                            </div>

                            {/* Submit Button */ }
                            <Button type="submit" className="mt-6">
                                { operationLabel }
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </AppLayout>
    );
};

export default CreateOrEditRole;