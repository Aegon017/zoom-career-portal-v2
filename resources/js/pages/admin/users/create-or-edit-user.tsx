
import DeleteAlert from '@/components/delete-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { User, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const CreateOrEditUser = ({ user, operation, operationLabel }: { user: User, operation: string, operationLabel: string }) => {
    const { errors } = usePage().props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Users',
            href: "/admin/users",
        },
        {
            title: operation,
            href: '',
        },
    ];

    const form = useForm<User>({
        defaultValues: {
            name: user?.name ?? "",
            email: user?.email ?? "",
            password: user?.password ?? ""
        }
    });

    const { handleSubmit, control, setError } = form;

    const onSubmit = (data: any) => {
        const handleErrors = (errors: any) => {
            if (errors && typeof errors === 'object') {
                Object.entries(errors).forEach(([field, message]) => {
                    setError(field as string, {
                        type: 'server',
                        message: message as string,
                    });
                });
            }
        };

        const routes = {
            Create: () => router.post("/admin/users", data, { onError: handleErrors }),
            Edit: () => router.put(`admin/users/${user.id}`, data, { onError: handleErrors }),
        };

        routes[operation as keyof typeof routes]?.();
    };

    const handleDelete = (id: number) => {
        router.delete(`/admin/users/${id}`);
    }

    const [alertOpen, setAlertOpen] = useState<boolean>(false);


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${operation} user`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 p-4">
                        <div className="flex justify-between">
                            <h1 className="text-2xl font-bold">{operation} user</h1>
                            {operation === 'Edit' && (
                                <>
                                    <Button variant="destructive" onClick={(e) => { e.preventDefault(); setAlertOpen(true) }}>Delete</Button>
                                    <DeleteAlert
                                        key={user.id}
                                        alertOpen={alertOpen}
                                        setAlertOpen={setAlertOpen}
                                        onDelete={() => handleDelete(user.id)}
                                    />
                                </>
                            )}
                        </div>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-4">
                                <FormField
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full name</FormLabel>
                                            <FormControl>
                                                <Input type="text" {...field} autoComplete="name" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" {...field} autoComplete="email" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit">{operationLabel}</Button>
                            <Button type="button" variant="outline" onClick={() => router.get("/admin/users")}>Cancel</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </AppLayout >
    );
}

export default CreateOrEditUser
