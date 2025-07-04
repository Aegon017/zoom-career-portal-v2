import { AppHeader } from "@/components/app-header";
import { User } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/phone-input";
import { toast } from "sonner";

type Step = "request" | "verify" | "verified";

interface Props {
    user: User;
    expires_at?: string;
    step?: Step;
    errors?: Record<string, string>;
}

export default function VerifyPhone( { user }: Props ) {
    const { props } = usePage<Props>();
    const { data, setData, post, processing, errors, clearErrors } = useForm( {
        phone: user.phone || "",
        code: "",
    } );

    const [ step, setStep ] = useState<Step>(
        props.step ?? ( user.phone_verified_at ? "verified" : "request" )
    );
    const [ expiresAt, setExpiresAt ] = useState<string | undefined>( props.expires_at );
    const [ timer, setTimer ] = useState( 0 );

    // Sync props from server
    useEffect( () => {
        if ( props.step ) setStep( props.step );
        if ( props.expires_at ) setExpiresAt( props.expires_at );
    }, [ props.step, props.expires_at ] );

    // Countdown timer
    useEffect( () => {
        if ( step === "verify" && expiresAt ) {
            const expiry = new Date( expiresAt ).getTime();
            const interval = setInterval( () => {
                const now = Date.now();
                const secondsLeft = Math.max( 0, Math.floor( ( expiry - now ) / 1000 ) );
                setTimer( secondsLeft );
                if ( secondsLeft <= 0 ) clearInterval( interval );
            }, 1000 );
            return () => clearInterval( interval );
        } else {
            setTimer( 0 );
        }
    }, [ step, expiresAt ] );

    const sendOtp = () => {
        post( "/otp/send", {
            data: { phone: data.phone },
            preserveScroll: true,
            onSuccess: () => {
                toast.success( "OTP sent successfully." );
                setStep( "verify" );
                clearErrors();
            },
        } );
    };

    const verifyOtp = () => {
        post( "/otp/verify", {
            data: { code: data.code },
            preserveScroll: true,
            onSuccess: () => {
                toast.success( "Phone verified successfully." );
                setStep( "verified" );
                clearErrors();
            },
        } );
    };

    return (
        <>
            <Head title="Verify Phone" />
            <AppHeader />
            <div className="flex items-center justify-center min-h-[80vh] bg-muted px-4">
                <Card className="w-full max-w-md shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">
                            { step === "request"
                                ? "Enter Phone Number"
                                : step === "verify"
                                    ? "Verify OTP"
                                    : "Phone Verified" }
                        </CardTitle>

                        { step === "verify" && timer > 0 && (
                            <Button
                                variant="link"
                                className="text-gray-500 p-0 h-auto"
                                onClick={ () => {
                                    setStep( "request" );
                                    setData( "code", "" );
                                    clearErrors( "code" );
                                } }
                            >
                                Change Number
                            </Button>
                        ) }
                    </CardHeader>

                    <CardContent className="space-y-6">
                        { step === "request" && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <PhoneInput
                                        id="phone"
                                        value={ data.phone }
                                        onChange={ ( value ) => setData( "phone", value ?? "" ) }
                                        placeholder="Enter your phone number"
                                    />
                                    { errors.phone && (
                                        <p className="text-sm text-red-500">{ errors.phone }</p>
                                    ) }
                                </div>
                                <Button
                                    onClick={ sendOtp }
                                    disabled={ processing || !data.phone }
                                    className="w-full"
                                >
                                    Send OTP
                                </Button>
                            </>
                        ) }

                        { step === "verify" && (
                            <>
                                <div className="space-y-2 text-center">
                                    <Label htmlFor="otp">
                                        Enter the 6-digit OTP sent to your phone
                                    </Label>
                                    <div className="flex justify-center pt-4">
                                        <InputOTP
                                            maxLength={ 6 }
                                            value={ data.code }
                                            onChange={ ( val ) => setData( "code", val ) }
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={ 0 } />
                                                <InputOTPSlot index={ 1 } />
                                                <InputOTPSlot index={ 2 } />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot index={ 3 } />
                                                <InputOTPSlot index={ 4 } />
                                                <InputOTPSlot index={ 5 } />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                    { errors.code && (
                                        <p className="text-sm text-red-500">{ errors.code }</p>
                                    ) }
                                </div>

                                <div className="flex justify-between items-center text-sm pt-2 text-muted-foreground">
                                    { timer > 0 ? (
                                        <span>Resend available in { timer }s</span>
                                    ) : (
                                        <Button
                                            variant="link"
                                            className="text-blue-500 p-0 h-auto"
                                            onClick={ sendOtp }
                                        >
                                            Resend OTP
                                        </Button>
                                    ) }
                                    <Button
                                        onClick={ verifyOtp }
                                        disabled={ processing || data.code.length !== 6 }
                                    >
                                        Verify OTP
                                    </Button>
                                </div>
                            </>
                        ) }

                        { step === "verified" && (
                            <p className="text-green-600 text-center">
                                Your phone number is verified!
                            </p>
                        ) }
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
