<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Otp;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

final class OtpService
{
    public function generateCode(): string
    {
        return mb_str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public function sendOtp($user, string $phone): Otp
    {
        $existingOtp = Otp::where('user_id', $user->id)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        if ($existingOtp && $existingOtp->created_at->diffInSeconds(now()) < 60) {
            return $existingOtp;
        }

        $code = $this->generateCode();

        $success = $this->sendSms(
            $phone,
            sprintf('Hello %s, Thank you for registering with zoomgroup.com. Your one-time password is %s. - Zoom Technologies.', $user->name, $code)
        );

        if (! $success) {
            throw new Exception('SMS sending failed. OTP not created.');
        }

        return Otp::create([
            'user_id' => $user->id,
            'phone' => $phone,
            'code' => $code,
            'expires_at' => now()->addMinutes(1),
        ]);
    }

    public function sendSms(string $phone, string $message): bool
    {
        $response = Http::get(config('services.sms.url'), [
            'authorization' => config('services.sms.api_key'),
            'sender_id' => config('services.sms.sender_id'),
            'message' => $message,
            'template_id' => config('services.sms.template_id'),
            'entity_id' => config('services.sms.entity_id'),
            'route' => 'dlt_manual',
            'numbers' => $phone,
        ]);

        if (! $response->successful()) {
            Log::warning('Failed to send SMS OTP', [
                'response' => $response->body(),
                'phone' => $phone,
            ]);
        }

        return $response->successful();
    }

    public function verifyOtp($user): bool
    {
        $otp = Otp::where('user_id', $user->id)
            ->where('expires_at', '>', now())
            ->latest()
            ->first();

        $user->update([
            'phone_verified_at' => now(),
            'phone' => $otp->phone,
        ]);

        $otp->delete();

        return true;
    }
}
