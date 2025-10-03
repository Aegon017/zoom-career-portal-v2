import { AppHeader } from "@/components/app-header";
import { PhoneInput } from "@/components/phone-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { User } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Step = "request" | "verify" | "verified";

interface Props {
	user: User;
	expires_at?: string;
	step?: Step;
	errors?: Record<string, string>;
	[key: string]: unknown;
}

export default function VerifyPhone({ user }: Props) {
	const { props } = usePage<Props>();
	const { data, setData, post, processing, errors, clearErrors } = useForm({
		phone: user.phone || "",
		code: "",
	});

	const [step, setStep] = useState<Step>(
		props.step ?? (user.phone_verified_at ? "verified" : "request"),
	);
	const [expiresAt, setExpiresAt] = useState<string | undefined>(
		props.expires_at,
	);
	const [timer, setTimer] = useState(0);

	// Sync props from server
	useEffect(() => {
		if (props.step) setStep(props.step);
		if (props.expires_at) setExpiresAt(props.expires_at);
	}, [props.step, props.expires_at]);

	// Countdown timer
	useEffect(() => {
		if (step === "verify" && expiresAt) {
			const expiry = new Date(expiresAt).getTime();
			const interval = setInterval(() => {
				const now = Date.now();
				const secondsLeft = Math.max(0, Math.floor((expiry - now) / 1000));
				setTimer(secondsLeft);
				if (secondsLeft <= 0) clearInterval(interval);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setTimer(0);
		}
	}, [step, expiresAt]);

	const sendOtp = () => {
		post("/otp/send", {
			preserveScroll: true,
			onSuccess: () => {
				toast.success("OTP sent successfully.");
				setStep("verify");
				clearErrors();
			},
		});
	};

	const verifyOtp = () => {
		post("/otp/verify", {
			preserveScroll: true,
			onSuccess: () => {
				toast.success("Phone verified successfully.");
				setStep("verified");
				clearErrors();
			},
		});
	};

	return (
		<>
			<Head title="Verify Phone" />
			<AppHeader />
			<div className="bg-muted flex min-h-[80vh] items-center justify-center px-4">
				<Card className="w-full max-w-md shadow-lg">
					<CardHeader className="text-center">
						<CardTitle className="text-2xl">
							{step === "request"
								? "Enter Phone Number"
								: step === "verify"
									? "Verify OTP"
									: "Phone Verified"}
						</CardTitle>

						{step === "verify" && timer > 0 && (
							<Button
								variant="link"
								className="h-auto p-0 text-gray-500"
								onClick={() => {
									setStep("request");
									setData("code", "");
									clearErrors("code");
								}}
							>
								Change Number
							</Button>
						)}
					</CardHeader>

					<CardContent className="space-y-6">
						{step === "request" && (
							<>
								<div className="space-y-2">
									<Label htmlFor="phone">Phone Number</Label>
									<PhoneInput
										id="phone"
										value={data.phone}
										onChange={(value) => setData("phone", value ?? "")}
										placeholder="Enter your phone number"
									/>
									{errors.phone && (
										<p className="text-sm text-red-500">{errors.phone}</p>
									)}
								</div>
								<Button
									onClick={sendOtp}
									disabled={processing || !data.phone}
									className="w-full"
								>
									Send OTP
								</Button>
							</>
						)}

						{step === "verify" && (
							<>
								<div className="space-y-2 text-center">
									<Label htmlFor="otp">
										Enter the 6-digit OTP sent to your phone
									</Label>
									<div className="flex justify-center pt-4">
										<InputOTP
											maxLength={6}
											value={data.code}
											onChange={(val) => setData("code", val)}
										>
											<InputOTPGroup>
												<InputOTPSlot index={0} />
												<InputOTPSlot index={1} />
												<InputOTPSlot index={2} />
											</InputOTPGroup>
											<InputOTPSeparator />
											<InputOTPGroup>
												<InputOTPSlot index={3} />
												<InputOTPSlot index={4} />
												<InputOTPSlot index={5} />
											</InputOTPGroup>
										</InputOTP>
									</div>
									{errors.code && (
										<p className="text-sm text-red-500">{errors.code}</p>
									)}
								</div>

								<div className="text-muted-foreground flex items-center justify-between pt-2 text-sm">
									{timer > 0 ? (
										<span>Resend available in {timer}s</span>
									) : (
										<Button
											variant="link"
											className="h-auto p-0 text-blue-500"
											onClick={sendOtp}
										>
											Resend OTP
										</Button>
									)}
									<Button
										onClick={verifyOtp}
										disabled={processing || data.code.length !== 6}
									>
										Verify OTP
									</Button>
								</div>
							</>
						)}

						{step === "verified" && (
							<p className="text-center text-green-600">
								Your phone number is verified!
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
