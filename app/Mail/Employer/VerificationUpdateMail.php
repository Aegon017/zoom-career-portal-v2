<?php

declare(strict_types=1);

namespace App\Mail\Employer;

use App\Models\Company;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

final class VerificationUpdateMail extends Mailable implements ShouldQueue
{
    use Queueable;
    use SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $user,
        public Company $company,
        public ?string $reason
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verification Update Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'mails.employer.verification-update-mail',
            with: [
                'employer_name' => $this->user->name,
                'status' => $this->company->companyUsers()->where('user_id', $this->user->id)->first()->verification_status,
                'status_text' => ucfirst((string) $this->company->companyUsers()->where('user_id', $this->user->id)->first()->verification_status),
                'company_name' => $this->company->company_name,
                'updated_at' => now()->format('F j, Y'),
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
