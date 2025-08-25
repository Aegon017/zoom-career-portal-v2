import { Head, Link, useForm } from '@inertiajs/react'
import { LoaderCircle, Info } from 'lucide-react'
import { FormEventHandler } from 'react'

import InputError from '@/components/input-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import AuthLayout from '@/layouts/auth-layout'
import TextLink from '@/components/text-link'

interface Props {
    canResetPassword: boolean
}

export default function StudentLogin( { canResetPassword }: Props ) {
    const { data, setData, post, processing, errors } = useForm<{
        email: string
        password: string
    }>( {
        email: '',
        password: '',
    } )

    const submit: FormEventHandler = ( e ) => {
        e.preventDefault()
        post( '/remote/login' )
    }

    return (
        <AuthLayout title="Student Login" description="Login with your credentials">
            <Head title="Student Login" />

            {/* Instruction Box */ }
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                <div>
                    <p className="mb-2">
                        <strong>Students registered from Jan 2025 onwards:</strong>
                        <br />
                        Log in using your Zoom Group credentials.
                    </p>
                    <p>
                        <strong>Students enrolled before Jan 2025:</strong>
                        <br />
                        Use the email address you originally registered with at Zoom Technologies.
                    </p>
                </div>
            </div>

            {/* Login Form */ }
            <form className="flex flex-col gap-6" onSubmit={ submit }>
                <div className="grid gap-6">
                    {/* Email */ }
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            tabIndex={ 1 }
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
                                <TextLink
                                    href="/forgot-password"
                                    className="ml-auto text-sm"
                                    tabIndex={ 5 }
                                >
                                    Forgot password?
                                </TextLink>
                            ) }
                        </div>
                        <Input
                            id="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            tabIndex={ 2 }
                            value={ data.password }
                            onChange={ ( e ) => setData( 'password', e.target.value ) }
                            placeholder="••••••••"
                        />
                        <InputError message={ errors.password } />
                    </div>

                    {/* Extra Note */ }
                    <div className="mt-2 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                        <p>
                            Forgot your registered email? <br />
                            Simply click{ ' ' }
                            <Link
                                href="/student/register"
                                className="font-medium text-blue-700 underline hover:text-blue-900"
                            >
                                Register Here
                            </Link>{ ' ' }
                            and create a new account. Access will be granted after review by
                            our team within 3 business days.
                        </p>
                    </div>

                    {/* Submit Button */ }
                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={ 3 }
                        disabled={ processing }
                    >
                        { processing && (
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                        ) }
                        Login
                    </Button>
                </div>
            </form>
        </AuthLayout>
    )
}