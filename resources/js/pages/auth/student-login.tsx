import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { PhoneInput } from '@/components/phone-input';
import { Checkbox } from '@/components/ui/checkbox';

export default function StudentRegistration() {
    const { data, setData, post, processing, errors, reset } = useForm<{
        name: string;
        email: string;
        password: string;
        phone: string;
        course_completed: string;
        student_id: string;
        completed_month: string;
        do_not_remember: boolean;
    }>( {
        name: '',
        email: '',
        password: '',
        phone: '',
        course_completed: '',
        student_id: '',
        completed_month: '',
        do_not_remember: false,
    } );


    const submit: FormEventHandler = ( e ) => {
        e.preventDefault();
        post( '/remote/login', {
            onFinish: () => reset( 'phone' ),
        } );
    };

    return (
        <AuthLayout
            title="Student Registration"
            description="Fill in your details below"
            instruction="Please enter accurate details for verification purposes."
        >
            <Head title="Student Registration" />

            <form className="flex flex-col gap-6" onSubmit={ submit }>
                <div className="grid gap-6">
                    {/* Name */ }
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            required
                            autoFocus
                            tabIndex={ 1 }
                            value={ data.name }
                            onChange={ ( e ) => setData( 'name', e.target.value ) }
                            placeholder="John Doe"
                        />
                        <InputError message={ errors.name } />
                    </div>

                    {/* Email */ }
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            tabIndex={ 2 }
                            autoComplete="email"
                            value={ data.email }
                            onChange={ ( e ) => setData( 'email', e.target.value ) }
                            placeholder="email@example.com"
                        />
                        <InputError message={ errors.email } />
                    </div>

                    {/* Phone Number */ }
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number (with country code)</Label>
                        <PhoneInput
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            tabIndex={ 3 }
                            placeholder="+1 234 567 8901"
                            value={ data.phone }
                            onChange={ ( e: any ) => setData( 'phone', e?.target?.value ?? '' ) }
                        />
                        <InputError message={ errors.phone } />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={ 3 }
                            autoComplete="current-password"
                            value={ data.password ?? '' }
                            onChange={ ( e ) => setData( 'password', e.target.value ) }
                            placeholder="••••••••"
                        />
                        <InputError message={ errors.password } />
                    </div>

                    {/* Course Completed */ }
                    <div className="grid gap-2">
                        <Label htmlFor="course_completed">Course Completed</Label>
                        <Input
                            id="course_completed"
                            tabIndex={ 4 }
                            value={ data.course_completed }
                            onChange={ ( e ) => setData( 'course_completed', e.target.value ) }
                            placeholder="e.g., B.Sc Computer Science"
                        />
                        <InputError message={ errors.course_completed } />
                    </div>

                    {/* Student ID */ }
                    <div className="grid gap-2">
                        <Label htmlFor="student_id">Student ID</Label>
                        <Input
                            id="student_id"
                            tabIndex={ 5 }
                            value={ data.student_id }
                            onChange={ ( e ) => setData( 'student_id', e.target.value ) }
                            placeholder="e.g., 20231234"
                        />
                        <InputError message={ errors.student_id } />
                    </div>

                    {/* Month-Year of Completion */ }
                    <div className="grid gap-2">
                        <Label htmlFor="completed_month">Month & Year of Completion</Label>
                        <Input
                            id="completed_month"
                            type="month"
                            tabIndex={ 6 }
                            value={ data.completed_month }
                            onChange={ ( e ) => setData( 'completed_month', e.target.value ) }
                        />
                        <InputError message={ errors.completed_month } />
                    </div>

                    {/* Do Not Remember Checkbox */ }
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="do_not_remember"
                            name="do_not_remember"
                            checked={ data.do_not_remember }
                            onClick={ () => setData( 'do_not_remember', !data.do_not_remember ) }
                            tabIndex={ 7 }
                            className="h-4 w-4"
                        />
                        <Label
                            htmlFor="do_not_remember"
                            className="text-sm text-muted-foreground cursor-pointer select-none"
                        >
                            Don’t remember my login details —{ ' ' }
                            <span className="text-primary underline hover:text-primary/80">
                                click here
                            </span>
                        </Label>
                    </div>

                    <p className="text-sm text-muted-foreground mt-2">
                        Post verification you will be given access. We may contact you for additional details.
                    </p>

                    {/* Submit Button */ }
                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={ 8 }
                        disabled={ processing }
                    >
                        { processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        ) }
                        Submit
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
