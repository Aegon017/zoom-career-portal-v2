import InputError from "@/components/input-error";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthLayout from "@/layouts/auth-layout";
import { Head, useForm } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { FormEventHandler } from "react";

const StudentRegister = () => {
    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        password: string;
        phone: string;
        course_completed: string;
        student_id: string;
        completed_month: string;
    }>( {
        name: '',
        email: '',
        password: '',
        phone: '',
        course_completed: '',
        student_id: '',
        completed_month: '',
    } );

    const submit: FormEventHandler = ( e ) => {
        e.preventDefault();
        post( '/student/register' );
    };

    return (
        <AuthLayout
            title="Student Registration"
            description="Fill in your details below to register"
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
                            autoComplete="new-password"
                            value={ data.password }
                            onChange={ ( e ) => setData( 'password', e.target.value ) }
                            placeholder="••••••••"
                        />
                        <InputError message={ errors.password } />
                    </div>

                    {/* Phone */ }
                    <div className="grid gap-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <PhoneInput
                            id="phone"
                            name="phone"
                            required
                            placeholder="+1 234 567 8901"
                            value={ data.phone }
                            onChange={ ( value ) => setData( 'phone', value ?? '' ) }
                        />
                        <InputError message={ errors.phone } />
                    </div>

                    {/* Course */ }
                    <div className="grid gap-2">
                        <Label htmlFor="course_completed">Course Completed</Label>
                        <Input
                            id="course_completed"
                            required
                            value={ data.course_completed }
                            onChange={ ( e ) =>
                                setData( 'course_completed', e.target.value )
                            }
                            placeholder="e.g., B.Sc Computer Science"
                        />
                        <InputError message={ errors.course_completed } />
                    </div>

                    {/* Student ID */ }
                    <div className="grid gap-2">
                        <Label htmlFor="student_id">Student ID</Label>
                        <Input
                            id="student_id"
                            required
                            value={ data.student_id }
                            onChange={ ( e ) => setData( 'student_id', e.target.value ) }
                            placeholder="e.g., 20231234"
                        />
                        <InputError message={ errors.student_id } />
                    </div>

                    {/* Completion Date */ }
                    <div className="grid gap-2">
                        <Label htmlFor="completed_month">
                            Month & Year of Completion
                        </Label>
                        <Input
                            id="completed_month"
                            type="month"
                            required
                            value={ data.completed_month }
                            onChange={ ( e ) => setData( 'completed_month', e.target.value ) }
                        />
                        <InputError message={ errors.completed_month } />
                    </div>

                    <input type="hidden" name="type" value="student" />

                    <Button type="submit" className="mt-4 w-full" disabled={ processing }>
                        { processing && (
                            <LoaderCircle className="h-4 w-4 animate-spin mr-2" />
                        ) }
                        Register
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default StudentRegister;
