import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';
import { useEffect } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Checkbox } from '@/components/ui/checkbox';
import { router } from '@inertiajs/react';

export default function StudentLogin() {
    const { data, setData, post, processing, errors } = useForm<{
        email: string;
        password: string;
        do_not_remember: boolean;
    }>( {
        email: '',
        password: '',
        do_not_remember: false,
    } );

    useEffect( () => {
        if ( data.do_not_remember ) {
            router.visit( '/student/register' );
        }
    }, [ data.do_not_remember ] );

    const submit: FormEventHandler = ( e ) => {
        e.preventDefault();
        post( '/remote/login' );
    };

    return (
        <AuthLayout
            title="Student Login"
            description="Login with your credentials"
            instruction="If you don’t remember your login details, you can register below."
        >
            <Head title="Student Login" />

            <form className="flex flex-col gap-6" onSubmit={ submit }>
                <div className="grid gap-6">
                    {/* Email */ }
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={ 1 }
                            autoComplete="email"
                            value={ data.email }
                            onChange={ ( e ) => setData( 'email', e.target.value ) }
                            placeholder="email@example.com"
                        />
                        <InputError message={ errors.email } />
                    </div>

                    {/* Password */ }
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={ 2 }
                            autoComplete="current-password"
                            value={ data.password }
                            onChange={ ( e ) => setData( 'password', e.target.value ) }
                            placeholder="••••••••"
                        />
                        <InputError message={ errors.password } />
                    </div>

                    {/* Checkbox: go to register */ }
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="do_not_remember"
                            name="do_not_remember"
                            checked={ data.do_not_remember }
                            onClick={ () =>
                                setData( 'do_not_remember', !data.do_not_remember )
                            }
                            tabIndex={ 3 }
                            className="h-4 w-4"
                        />
                        <Label
                            htmlFor="do_not_remember"
                            className="text-sm text-muted-foreground cursor-pointer select-none"
                        >
                            Don’t remember my login details —{ ' ' }
                            <span className="text-primary underline hover:text-primary/80">
                                click here to register
                            </span>
                        </Label>
                    </div>

                    {/* Submit Button */ }
                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={ 4 }
                        disabled={ processing }
                    >
                        { processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        ) }
                        Login
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
