import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import TextLink from '@/components/text-link';

interface Props {
    canResetPassword: boolean
}

export default function StudentLogin( { canResetPassword }: Props ) {
    const { data, setData, post, processing, errors } = useForm<{
        email: string;
        password: string;
    }>( {
        email: '',
        password: '',
    } );

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
                        <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            { canResetPassword && (
                                <TextLink href="/forgot-password" className="ml-auto text-sm" tabIndex={ 5 }>
                                    Forgot password?
                                </TextLink>
                            ) }
                        </div>
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

                    {/* Registration link instead of checkbox */ }
                    <div className="text-muted-foreground text-sm">
                        Don’t remember your login details?{ ' ' }
                        <Link href="/student/register" className="text-primary hover:text-primary/80 underline">
                            Click here to register
                        </Link>
                    </div>

                    {/* Submit Button */ }
                    <Button type="submit" className="mt-4 w-full" tabIndex={ 3 } disabled={ processing }>
                        { processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> }
                        Login
                    </Button>
                </div>
            </form>
        </AuthLayout >
    );
}
